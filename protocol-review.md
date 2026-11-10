# Protocol calculator audit — Neo Formulary

**Review date:** 10 November 2026  
**Scope:** Static review of the hard-coded neonatal protocol calculators in `index.html`. Arithmetic and internal consistency were checked where determinable. This is not a full independent validation of every clinical regimen.

## Release-blocking / high-priority items

### 1. PPHN magnesium sulphate — dose and target mismatch

The PPHN tab currently displays a rescue loading dose of 50 mg/kg over 30 minutes, maintenance 20–50 mg/kg/hour, and target serum magnesium 1.5–2.5 mmol/L. The medication database uses the same PPHN regimen.

The ANMF 2024 newborn-use-only guideline lists a PPHN loading dose of 200 mg/kg magnesium sulphate over 60 minutes, then 20–50 mg/kg/hour, targeting serum magnesium 3.5–5.5 mmol/L. The loading dose and target in the app therefore do not match this neonatal reference.

**Action:** Local neonatology/pharmacy must decide whether the unit's 50 mg/kg loading is a deliberately different rescue regimen or a transcription error. Confirm salt versus elemental magnesium units, concentration, dilution, infusion duration, monitoring, target and stop criteria. Do not automatically substitute the ANMF regimen without approval.

### 2. Hyperkalaemia — neonatal insulin/glucose algorithm is not unambiguously reconciled

The app gives an insulin dose of 0.1 unit/kg with D10 5 mL/kg over 30 minutes (plus a slower 0.05–0.1 unit/kg option). The MOH Paediatric Protocols 5th Edition hyperkalaemia algorithm describes starting glucose 10% at 5 mL/kg/hour and adding insulin 0.05 unit/kg/hour once BSL is >10 mmol/L and potassium is not falling. Other paediatric emergency guidance uses a bolus approach. These are different regimens and should not be blended.

**Action:** Have the NICU agree one explicit neonatal pathway. Label the trigger, bolus versus infusion, glucose infusion rate, insulin concentration, line priming, bedside glucose frequency, potassium recheck interval, duration and escalation. Separate the local neonatal pathway from the general paediatric algorithm.

### 3. Hyperkalaemia — bicarbonate indication

The app places IV sodium bicarbonate in the treatment sequence for severe and mild-to-moderate hyperkalaemia without explicitly restricting it to significant metabolic acidosis. The MOH 5th Edition algorithm describes bicarbonate as optional when acidosis is present.

**Action:** State the indication and avoid implying routine bicarbonate for all hyperkalaemia. Confirm whether and when bicarbonate is appropriate in preterm neonates, and ensure it is not infused simultaneously with calcium.

### 4. Calcium polystyrene sulphonate — neonatal dose discrepancy

The app uses 0.3–0.6 g/kg every 6 hours, rectally in neonates. MOH paediatric protocols include a general 0.3–0.6 g/kg every-6-hour regimen, while the MOH Paediatric Pharmacy Services Guideline and FUKKM list a neonatal rectal dose of 0.125–0.25 g/kg four times daily and advise against oral use in neonates.

**Action:** Reconcile the neonatal dose, product, route, frequency, maximum dose, preparation and evacuation instructions with pharmacy. Explicitly address bowel injury risk and contraindications (e.g. NEC, ileus, obstruction, perforation, recent abdominal surgery). Do not apply the general paediatric dose to neonates by default.

### 5. Sodium replacement — neonatal total-body-water factor

The electrolyte tab and sodium chloride 10% database entry use sex-specific deficit factors (0.6 male / 0.5 female). ANMF's 3% sodium chloride newborn guidance states that newborn total body water should be considered as 0.75 × weight for deficit calculations. The app also combines oral supplementation, severe symptomatic hypertonic-saline bolus and deficit calculation in one section.

**Action:** Separate maintenance supplementation, deficit estimation and emergency symptomatic correction. Confirm the neonatal factor, target, correction rate, 24-hour limit and sodium monitoring schedule with the local protocol. Do not use the current sex-specific factor as the neonatal default without approval.

## Other important items for focused review

### 6. Hypoglycaemia — stated GIR versus displayed D10 volume

The tab states a target GIR of 6–8 mg/kg/min but displays D10 at 60–90 mL/kg/day. D10 provides 100 mg/mL glucose:
- 60 mL/kg/day = approximately 4.17 mg/kg/min.
- 90 mL/kg/day = approximately 6.25 mg/kg/min.

Thus, the lower part of the displayed range does not deliver the stated GIR, and the upper end reaches only about 6.25 mg/kg/min.

**Action:** State the GIR delivered by each volume, distinguish term from preterm starting GIR and calculate the required rate from the selected target. Include all concurrent glucose sources and fluid restrictions in a future GIR calculator; avoid implying a fixed D10 volume always achieves GIR 6–8.

### 7. Midazolam — sedation bolus range

The sedation tab lists IV bolus 0.1–0.5 mg/kg. The range is broad and the upper end is higher than doses in some neonatal-specific monographs; other paediatric emergency references use 0.1–0.2 mg/kg. The drug database lists the same broad local range.

**Action:** Confirm the intended indication (procedural sedation, ventilated infant sedation, or seizure rescue), route, dilution and administration time. Consider displaying indication-specific dose bands and a senior-review warning for higher doses. Avoid a single generic range that can be applied to all neonatal contexts.

### 8. Neonatal seizures — sodium valproate in the protocol ladder

The anticonvulsant tab includes sodium valproate as a routine loading/maintenance option. The 2023 ILAE neonatal seizure recommendations identify phenobarbital as first-line and phenytoin, levetiracetam, midazolam or lidocaine as possible second-line options; valproate is not listed among the recommended second-line agents. Valproate also carries particular hepatotoxicity/mitochondrial safety concerns in very young children.

**Action:** Restrict or remove valproate from the default neonatal pathway unless the local paediatric neurology/metabolic team approves a narrowly defined indication with contraindication screening and monitoring.

### 9. Neonatal seizures — duration of maintenance antiseizure medication

The tab displays phenobarbital maintenance as unit practice 2 mg/kg once daily, with a wider 2–10 mg/kg/day range. ILAE 2023 recommends stopping antiseizure medication before discharge after cessation of acute provoked neonatal seizures when there is no evidence of neonatal-onset epilepsy.

**Action:** Add an explicit reassessment/stop plan and distinguish acute provoked seizures from neonatal-onset epilepsy or ongoing seizures. Do not let a maintenance dose appear to imply automatic continuation after discharge.

### 10. Antifungal protocol — treatment versus prophylaxis

The antifungal tab groups prophylaxis and treatment regimens in one view. Fluconazole prophylaxis and treatment doses differ materially, and treatment selection depends on species, susceptibility, prior azole exposure, renal function and local epidemiology.

**Action:** Keep indication-specific headings and add explicit eligibility criteria, duration, renal adjustment, culture/susceptibility review and infectious-disease consultation triggers.

### 11. Sepsis/NEC antibiotic algorithms — local antibiogram and age bands

The sepsis and NEC tabs contain multiple empiric and organism-directed antibiotic regimens. Their dosing functions use PMA and postnatal age bands, and some alternatives are based on local practice.

**Action:** Pharmacy and microbiology should verify each dose/interval against the current Hospital Miri antimicrobial guideline, local antibiogram, culture-directed pathways, renal adjustment, TDM requirements and antimicrobial stewardship policy. Specifically review the gentamicin/amikacin, vancomycin, meropenem, piperacillin-tazobactam and polymyxin B branches.

## Arithmetic checks completed

- Dopamine/dobutamine: 15 mg/kg in 50 mL gives 5 microgram/kg/min at 1 mL/hour; 30 mg/kg in 50 mL gives 10 microgram/kg/min at 1 mL/hour.
- Adrenaline/noradrenaline: the displayed 0.15/0.3 mg/kg in 50 mL dilutions correspond to 0.05/0.1 microgram/kg/min per 1 mL/hour respectively.
- Milrinone: 1.5 mg/kg in 50 mL corresponds to 0.5 microgram/kg/min per 1 mL/hour.
- Vasopressin: 0.5 unit/kg in 50 mL corresponds to 0.01 unit/kg/hour per 1 mL/hour; 0.3 unit/kg in 50 mL corresponds to 0.006 unit/kg/hour per 1 mL/hour.
- Potassium chloride 10% (1.34 mmol/mL): 0.15 mL/kg/hour corresponds to approximately 0.20 mmol/kg/hour; 0.3 mL/kg/hour corresponds to approximately 0.40 mmol/kg/hour.
- These are concentration arithmetic checks only; they do not validate clinical appropriateness, stock product, final volume, line suitability or pump programming.

## Software finding fixed in this branch

The per-kg dose annotation helper contained an incorrectly escaped digit pattern in its regular-expression string, so many dose quantities were not highlighted. The expression has been corrected and tested against single doses and ranges (e.g. 50 mg/kg and 0.5–1 mg/kg). This is a display correction; it does not alter dose calculations.

## Sources reviewed for discrepancy triage

- Malaysian Ministry of Health, *Paediatric Protocols for Malaysian Hospitals*, 5th Edition — hyperkalaemia algorithm and paediatric emergency drug table.
- Malaysian MOH, *Paediatric Pharmacy Services Guideline* — neonatal calcium polystyrene sulphonate dosing.
- Australian Neonatal Medicines Formulary (ANMF), *Magnesium — Newborn use only* (2024).
- Australian Neonatal Medicines Formulary (ANMF), *Sodium chloride 3% — Newborn use only*.
- Royal Children's Hospital Melbourne, neonatal hypoglycaemia guidance — GIR ranges.
- International League Against Epilepsy (ILAE), neonatal seizure treatment recommendations (2023).
- Neonatal drug monographs and Malaysian paediatric emergency guidance for midazolam — to be reconciled with the local approved dosing guide.

## Sign-off

Before release, the Hospital Miri NICU clinical lead and neonatal pharmacist should review each high-priority item, document the accepted local regimen, approve the exact text and calculations, and record reviewer/date/version. The app should remain a reference aid and must not be treated as a prescribing authority.
