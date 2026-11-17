# BROWSER EXTENSION INSTALLATION & VERIFICATION GUIDE

## Overview
The Matric Tracker Focus Blocker extension enforces distraction-free study sessions by blocking distracting domains (YouTube, TikTok, Instagram, Reddit, X/Twitter, etc.) and redirecting them to the Matric Tracker focus reminder screen.

Build artifacts are located in:
- Chrome: `apps/extension/dist/chrome`
- Microsoft Edge: `apps/extension/dist/edge`
- Mozilla Firefox: `apps/extension/dist/firefox`

---

## 1. Google Chrome Installation (Developer Mode)
1. Open Google Chrome.
2. In the URL bar, navigate to `chrome://extensions`.
3. In the top-right corner, toggle **Developer mode** to ON.
4. Click **Load unpacked** in the top-left corner.
5. In the file dialog, navigate to and select:
   `D:\CODING\Matric taker\apps\extension\dist\chrome`
6. Click **Select Folder**.
7. The **Matric Tracker — Focus Blocker** card will appear with status active.
8. Click the Extensions puzzle icon in Chrome toolbar and pin Matric Tracker.

---

## 2. Microsoft Edge Installation
1. Open Microsoft Edge.
2. In the URL bar, navigate to `edge://extensions`.
3. In the left navigation menu, turn ON **Developer mode**.
4. Click **Load unpacked**.
5. Select the folder:
   `D:\CODING\Matric taker\apps\extension\dist\edge`
6. Click **Select Folder**.

---

## 3. Mozilla Firefox Installation (Temporary Add-on Mode)
1. Open Mozilla Firefox.
2. In the URL bar, navigate to `about:debugging#/runtime/this-firefox`.
3. Under **Temporary Extensions**, click **Load Temporary Add-on...**.
4. Navigate to:
   `D:\CODING\Matric taker\apps\extension\dist\firefox`
5. Select the `manifest.json` file inside that folder.
6. The extension will activate immediately.

---

## 4. Verification & Testing
1. Click the Matric Tracker extension icon in your browser toolbar.
2. Confirm the status badge reads **Active** (green).
3. Open a new tab and navigate to `https://www.youtube.com` or `https://www.reddit.com`.
4. Confirm you are immediately redirected to the distraction-free screen:
   `Stay Focused on Your Goal — Matric Study Mode Active`.
5. In the extension popup, click **Emergency Pause (10 mins)**.
6. Refresh the blocked site and verify temporary access is granted during the emergency pause.
