# EE Board Exam Reviewer — Web App

This folder is a static, installable Progressive Web App (PWA) made from the supplied Anki package.

## Included
- `index.html` — application page
- `styles.css` — responsive light/dark interface
- `app.js` — practice, browse, search, bookmarks and progress logic
- `data/questions.json` — 108 questions, options, answers and explanations extracted from the Anki deck
- `manifest.webmanifest` — installable app metadata
- `sw.js` — offline cache service worker
- `icons/` — 192×192 and 512×512 app icons

## Publish with GitHub Pages
1. Create a new GitHub repository.
2. Upload the **contents** of this folder (not the enclosing folder itself) to the repository root.
3. In the repository, open **Settings → Pages**.
4. Under Build and deployment, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
5. Wait for GitHub Pages to publish. Open the published HTTPS address once while online.

## Install on iPhone/iPad
1. Open the published HTTPS address in Safari.
2. Tap **Share** → **Add to Home Screen**.
3. Confirm the name and tap **Add**.

## Offline and saved data
- After the first successful online load, the service worker caches the app and question bank for offline use.
- Answer history, bookmarks and theme preference are stored in the browser's local storage on that device.
- Clearing Safari website data, changing browsers, or using a different device may remove or not carry over that progress. There is no cloud sync or automatic backup in this version.
- The app does not require a login and does not send study progress to a server.

## Notes
- Serve from HTTPS (GitHub Pages does this); service workers do not work reliably when opening `index.html` directly as a local file.
- The app uses an optional Google Fonts import for typography; the system font fallback works offline.
- The question text and explanations are retained from the provided Anki deck.
