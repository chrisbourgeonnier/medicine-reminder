# 💊 Medicine Reminder

A lightweight, no-fuss app to help you remember your daily medicine.
Built as a static web app — no accounts, no servers, no subscriptions.
Just open it, tap a button, and you're done.

## What it does

- Shows you a simple daily status: taken or not taken (green or red).
- One tap to mark your medicine as taken, one tap to undo if needed.
- Monthly calendar so you can see your history at a glance.
- Mark when you start a new box with a 📦 on the calendar.
- Sends a notification at 10am if you haven't taken your medicine yet.
- Works offline and can be installed on your phone like a native app (PWA).
- All data stays on your device — nothing is sent anywhere.

---

## Usage

1. Open the app and type your medicine name at the top.
2. Tap **"Take Medicine Now"** when you've taken it — the screen turns green.
3. If you accidentally tapped it, use **"Undo"** to revert.
4. Tick **"New box started today"** when you open a fresh pack.
5. Browse the calendar to review past days.

---

## Installation (PWA)

To install on your phone as a home screen app:

1. Open the app in **Chrome** (Android) or **Safari** (iOS).
2. Tap the browser menu → **"Add to Home Screen"**.
3. The app will install and work offline from that point.

> Firefox on Android has limited PWA support. Chrome is recommended.

---

## Notifications

The app will request notification permission on first load.
If you allow it, you'll receive a reminder at **10:00am** each day if your medicine hasn't been marked as taken.

To enable manually if you dismissed the prompt:
- Chrome: tap the 🔒 lock icon in the address bar → Permissions → Notifications → Allow.

> Notifications only work reliably when the app is installed as a PWA.

---

## Technical

- **Stack**: HTML, CSS, JavaScript — no frameworks, no dependencies.
- **Hosting**: GitHub Pages (static).
- **Storage**: Browser `localStorage` — data persists on device, never leaves it.
- **PWA**: `manifest.json` + service worker (`sw.js`) for offline support and notifications.
- **Notifications**: Web Notifications API via the service worker, scheduled with `setTimeout`.

### File structure
medicine-reminder/
├── index.html
├── styles.css
├── script.js
├── sw.js
├── manifest.json
└── assets/
&emsp;&emsp;├── drugs-192.png
&emsp;&emsp;└── drugs-512.png

### Local development

```bash
git clone https://github.com/chrisbourgeonnier/medicine-reminder.git
cd medicine-reminder
# Open index.html in your browser, or use a local server:
npx serve .
```

### Deployment

Any push to the `main` branch automatically deploys via GitHub Pages.
