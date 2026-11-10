# Neo Formulary

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
4. Check: tap **↻** at the top of the app to check immediately; tap **ⓘ** to see the drug count and the date the drug list was last published.

If an uploaded file can't be read (e.g. the `name` heading was deleted), phones keep using the previous list and show a warning — nothing is lost. Every upload is kept in GitHub's history, so an older version can be restored from the file's **History** page.

## Updating the app itself

Upload a new `index.html` the same way. Open phones show a "new version available — Reload" message; others get it on next open.

## If the home-screen icon doesn't show

- Check the four icon `.png` files are in the repository next to `index.html` (not in a sub-folder).
- On the phone, **delete the old home-screen shortcut and add it again** — iPhone and Android keep the icon from the first time it was added.
- Open the app from its GitHub Pages web address, not a downloaded copy of `index.html`.


## Safety and clinical governance (review branch)

- Patient-entry validation now checks weight, gestational age weeks/days, calendar-valid date/time of birth, and prevents a future birth date/time.
- The patient banner warns when the recorded weight is more than 24 hours old. Re-weigh and update the patient record before using calculated doses. This is a prompt, not a substitute for checking the current measured weight.
- Drug-list synchronisation rejects malformed CSV quotation, duplicate generic-name rows, and rows containing data beyond the header. A rejected update leaves the last known-good database in place.
- Clinical dose changes are not made automatically. See `clinical-review.md` for drug-database discrepancies and `protocol-review.md` for protocol calculator findings; both require local neonatal/pharmacy review and documented approval.

**Governance before clinical use:** all doses, concentrations, dilution instructions, infusion rates, maximum doses, age/gestation bands, and protocol algorithms must be verified against current Malaysian/local guidance and signed off by the Hospital Miri NICU clinical lead and pharmacy. The app is a reference aid, not a prescribing or administration authority.

## Regression tests (review branch)

Run the pure-function regression suite from the repository root with Node.js 20 or later:

```bash
node --test tests/dose-validation.test.js
```

The suite executes the relevant display, dose-annotation, and CSV-validation functions extracted from `index.html`. It covers representative weights (0.5, 1, 2.5 and 4 kg), dose-range annotation, CSV quoting/schema rejection, and selected arithmetic checks. GitHub Actions runs the suite on pushes to the review branch and on pull requests to `main`.

**Test scope limitation:** these are software regression and arithmetic tests, not independent validation of clinical dose selection, dose intervals, maximum doses, dilution instructions, infusion rates, or bedside suitability. Clinical sign-off remains mandatory.
