# Clinical safety review — Neo Formulary

**Review date:** 10 November 2026  
**Scope:** Static review of `index.html`, `drugs.csv`, `sw.js`, and `README.md`.  
**Status:** Review findings only. This document is not a prescribing guideline and does not authorise any dose change.

## Important safety boundary

No clinical dose, concentration, dilution, infusion rate, maximum dose, or protocol algorithm has been changed in this branch. The discrepancies below require review against the current Hospital Miri/National Malaysian neonatal protocol, pharmacy preparation standards, and a documented clinical sign-off before any database change is approved.

## Database and offline consistency

- The CSV contains 144 drug entries.
- The embedded offline fallback contains the same 144 names and, in the fields compared (dose, brand, reference, diluent, incompatibilities, administration method, and preparation instructions), matched the CSV at the time of review.
- Four CSV entries have no reference recorded: acetazolamide 250 mg tablet; dexmedetomidine 100 microgram/mL injection; heparin 25,000 IU/5 mL injection; and sodium chloride 3% infusion. Add a traceable source and review date or explicitly document the locally approved source before treating these entries as verified.
- The `Class` field is not present in the CSV header; the application currently derives classes in code. Consider adding a controlled class field in a later schema migration, with a reviewed mapping and backward compatibility.

## High-priority clinical discrepancies for review

### 1. Magnesium sulphate — PPHN regimen

Current formulary entry: loading 50 mg/kg over 30 minutes, maintenance 20–50 mg/kg/hour, with serum magnesium target 1.5–2.5 mmol/L.

The ANMF newborn-use-only magnesium guideline (2024) describes a materially different PPHN regimen: loading 200 mg/kg over 60 minutes followed by 20–50 mg/kg/hour, with a target serum magnesium concentration of 3.5–5.5 mmol/L and specified cardiovascular/serum monitoring.

**Action:** Neonatologist and pharmacist to verify the intended local regimen, whether the dose is expressed as magnesium sulphate or elemental magnesium, product concentration, loading dilution, maximum rate, target range, monitoring frequency, and stopping criteria. Do not simply replace the current dose with the ANMF dose without local approval.

### 2. Calcium polystyrene sulphonate — neonatal hyperkalaemia

Current formulary entry: 0.3–0.6 g/kg every 6 hours, maximum 30 g/dose; neonatal rectal route only.

The Malaysian Ministry of Health Formulary (FUKKM) neonatal entry is reported as 0.125–0.25 g/kg rectally four times daily, with oral administration contraindicated in neonates and resin evacuation instructions.

**Action:** Pharmacy and neonatology to reconcile the product-specific dose, route, frequency, preparation, evacuation instructions, contraindications, and local availability. Confirm whether the current entry is intended for a different resin/product. Also review whether resin use is appropriate in the specific neonatal context; neonatal bowel injury risk must be considered.

### 3. Hyperkalaemia protocol — insulin/glucose sequence

The hard-coded protocol includes an insulin bolus-style option (0.1 unit/kg with D10) and a slower alternative. The MOH Paediatric Protocols, 5th Edition, describes a glucose-first/insulin-infusion approach in its hyperkalaemia algorithm, including glucose monitoring and subsequent insulin infusion when indicated.

**Action:** Review the complete local neonatal algorithm with the MOH protocol and current neonatal evidence. The protocol must distinguish emergency stabilisation (including ECG changes), stable hyperkalaemia, pseudohyperkalaemia exclusion, glucose infusion, insulin dose/rate, bedside glucose monitoring frequency, potassium recheck timing, and escalation/dialysis. Avoid presenting a paediatric regimen as neonatal-approved without explicit adaptation and sign-off.

### 4. Sodium deficit calculation and 3% sodium chloride

The oral sodium chloride entry uses a total-body-water factor of 0.6 for male and 0.5 for female patients. Neonatal sodium calculations require an age-appropriate total-body-water assumption; the ANMF 3% sodium chloride newborn guideline uses 0.75 in its neonatal calculation guidance. The current 3% sodium chloride CSV entry records concentration information only and does not provide a complete neonatal correction protocol.

**Action:** Separate maintenance supplementation, sodium deficit estimation, and emergency hypertonic-saline correction into distinct indications. Confirm the neonatal TBW factor, correction target/rate, maximum 24-hour correction, repeat sodium schedule, fluid restriction considerations, and local escalation criteria. Do not use the sex-specific factors as a neonatal default without validation.

## Other validation and governance improvements recommended

1. Add a reference field and last-reviewed date for every drug entry. Record source edition/version and whether the dose is local practice, national guidance, or an external reference.
2. Introduce a controlled high-alert flag for insulin, opioids/sedatives, vasoactive agents, anticoagulants, concentrated electrolytes, and other locally designated high-risk medicines.
3. For every dose, explicitly label the dose basis (e.g. mg/kg/**dose**, mg/kg/**day**, microgram/kg/**hour**, or units/kg/**hour**) and the salt/base basis where relevant.
4. Validate concentration, dilution, final volume, infusion rate, maximum dose, rounding, and line compatibility independently. Include representative test weights (e.g. 0.5, 1, 2.5, and 4 kg) and gestational/postnatal-age boundaries.
5. Add a clinical approval workflow: author, independent checker, pharmacist review, approval date, effective date, and change log. Do not publish unapproved changes to the live formulary.
6. Review the patient-weight freshness interval with the NICU team. The current UI warning at 24 hours is a safety prompt only; local policy may require a more recent weight for selected drugs or infusions.
7. Review all protocol calculators separately from the drug database. A correct drug entry does not guarantee a correct protocol algorithm.

## Sources to reconcile during clinical sign-off

- Malaysian Ministry of Health, *Paediatric Protocols for Malaysian Hospitals*, 5th Edition — hyperkalaemia.
- Malaysian Ministry of Health, *Formulari Ubat Kementerian Kesihatan Malaysia (FUKKM)* — calcium polystyrene sulphonate neonatal entry.
- Australian Neonatal Medicines Formulary (ANMF), *Magnesium sulphate — Newborn use only* (2024).
- Australian Neonatal Medicines Formulary (ANMF), *Sodium chloride 3% — Newborn use only*.
- Current Hospital Miri NICU protocols and pharmacy-approved preparation/compatibility references.

**Approval required before clinical release:** Hospital Miri NICU clinical lead + neonatal pharmacist, with further departmental/governance approval according to local policy.
