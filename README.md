# Neonatal Drug Formulary

Offline-capable web app for the Hospital Miri NICU, hosted on GitHub Pages.

## What's in this folder

| File | What it is | Do you edit it? |
|---|---|---|
| `drugs.csv` | The drug database (one row per drug) | **Yes — this is the file you update** |
| `index.html` | The app itself (protocol tabs, calculators, screens) | Only for protocol/tab changes |
| `sw.js` | Makes the app work offline | No |
| `manifest.webmanifest` | App name and home-screen icon | No |
| `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png` | Home-screen icon (Android and iPhone) | No — but they must sit next to index.html |

## First-time setup (once)

1. On GitHub, create a repository (e.g. `neonatal-formulary`).
2. **Add file → Upload files**, drag in *all* the files from this folder (there are no sub-folders), then **Commit changes**. Check the repository afterwards: the four `.png` icon files must be listed next to `index.html`.
3. **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*, Branch = `main`, folder = `/ (root)` → **Save**.
4. After 1–2 minutes the app is live at `https://<your-username>.github.io/neonatal-formulary/`.
5. Open that link on each ward phone once **with internet**, then add it to the home screen:
   - iPhone (Safari): Share → *Add to Home Screen*
   - Android (Chrome): ⋮ → *Install app* / *Add to Home screen*

From then on the app opens and works with no internet.

## Updating the drug list

1. Open `drugs.csv` in Excel or Google Sheets and make your changes.
   - Keep the first row (column headings) exactly as it is. The `name` column is required.
   - One drug per row. Blank rows are ignored.
   - Excel: **File → Save As → "CSV UTF-8 (Comma delimited)"** (plain "CSV" loses symbols like ≥ and µ).
   - Google Sheets: **File → Download → Comma-separated values (.csv)**, then rename the file to `drugs.csv`.
2. On GitHub: **Add file → Upload files**, drop in the new `drugs.csv` (same name — it replaces the old one), add a short note such as "Gentamicin interval corrected", then **Commit changes**.
3. Phones pick up the new list the next time the app is opened or brought back to the screen with internet, and every 15 minutes while open. GitHub can take up to ~10 minutes to publish a change.
4. Check: in the app, open **Search full drug database** — the status bar shows the drug count and "drugs.csv last published on GitHub: <date>". Tap **🔄 Refresh** to check immediately.

If an uploaded file can't be read (e.g. the `name` heading was deleted), phones keep using the previous list and show a warning — nothing is lost. Every upload is kept in GitHub's history, so an older version can be restored from the file's **History** page.

## Updating the app itself

Upload a new `index.html` the same way. Open phones show a "new version available — Reload" message; others get it on next open.

## If the home-screen icon doesn't show

- Check the four icon `.png` files are in the repository next to `index.html` (not in a sub-folder).
- On the phone, **delete the old home-screen shortcut and add it again** — iPhone and Android keep the icon from the first time it was added.
- Open the app from its GitHub Pages web address, not a downloaded copy of `index.html`.
