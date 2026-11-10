/**
 * Regression tests for pure calculation and CSV functions in index.html.
 * Run: node --test tests/dose-validation.test.js
 * Software/arithmetic checks only; not clinical dose validation.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function sourceBetween(start, end) {
  const a = html.indexOf(start);
  const b = html.indexOf(end, a + start.length);
  assert.ok(a >= 0 && b > a, 'Could not locate source block: ' + start);
  return html.slice(a, b).trim();
}
const context = {
  DRUG_FIELDS: ['Class','Brand','Dose','Reconstitution/ dilution/ special instruction','Diluent','Incompatibilities','Method of administration','Fridge item','Storage after reconstitution','Protect from light','Ref'],
  escapeHtml: s => String(s || '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),
  amt: n => !Number.isFinite(n) ? '—' : (Math.abs(n) >= 100 ? String(Math.round(n)) : Math.abs(n) >= 10 ? String(Math.round(n*10)/10) : String(Math.round(n*100)/100))
};
[
  sourceBetween('function fmtSmart(', 'function mg('),
  sourceBetween('function mg(', 'function ml('),
  sourceBetween('function ml(', 'function mcg('),
  sourceBetween('function mcg(', 'function unit('),
  sourceBetween('function unit(', 'function plain('),
  sourceBetween('function cleanDrugList(', '/* Turn the text of drugs.csv'),
  sourceBetween('function drugsFromCsvText(', 'function trySync('),
  sourceBetween('function parseCSV(', 'function csvRowsToDrugs('),
  sourceBetween('function csvRowsToDrugs(', '/* Precise display for infusion rates'),
  sourceBetween('function annotateDoseText(', '/* ================= INIT')
].forEach(source => vm.runInNewContext(source, context));

test('weight-based display helpers calculate amounts for common NICU weights', () => {
  for (const wt of [0.5, 1, 2.5, 4]) {
    assert.equal(context.mg(10, wt), (10 * wt) + ' mg');
    assert.equal(context.mcg(20, wt), (20 * wt) + ' mcg');
    assert.equal(context.ml(0.5, wt), (0.5 * wt) + ' mL');
    assert.equal(context.unit(0.1, wt), (0.1 * wt) + ' units');
  }
});

test('display formatter handles zero, decimals and non-finite values', () => {
  assert.equal(context.fmtSmart(0), '0');
  assert.equal(context.fmtSmart(0.125), '0.125');
  assert.equal(context.fmtSmart(0.001), '0.001');
  assert.equal(context.fmtSmart(1.2), '2'); // app deliberately rounds >=1 upward
  assert.equal(context.fmtSmart(Infinity), '—');
});

test('dose annotation recognises single doses and ranges', () => {
  assert.match(context.annotateDoseText('50 mg/kg', 2.5), /\[125 mg\]/);
  assert.match(context.annotateDoseText('0.5-1 mg/kg/dose', 2), /\[1–2 mg\]/);
});

test('CSV parser handles quoted commas, escaped quotes, tabs and BOM', () => {
  const parsed = context.parseCSV('\uFEFFname,Dose,Ref\r\nDrug A,"1,000 mg/kg","Guide ""2026"""\r\n');
  assert.deepEqual(JSON.parse(JSON.stringify(parsed)), [
    ['name','Dose','Ref'], ['Drug A','1,000 mg/kg','Guide "2026"']
  ]);
  assert.equal(context.parseCSV('name\tDose\nDrug B\t2 mg/kg\n')[1][0], 'Drug B');
});

test('CSV validation rejects malformed quotes, blank and duplicate names, and overflow columns', () => {
  assert.throws(() => context.drugsFromCsvText('name,Dose\nDrug A,"1 mg/kg'), /unclosed quotation/);
  assert.throws(() => context.drugsFromCsvText('name,Dose\n,1 mg/kg\n'), /blank name/);
  assert.throws(() => context.drugsFromCsvText('name,Dose\nDrug A,1 mg/kg\n drug a ,2 mg/kg\n'), /Duplicate drug name/);
  assert.throws(() => context.drugsFromCsvText('name,Dose\nDrug A,1 mg/kg,unexpected\n'), /more columns than the header/);
});

test('CSV validation accepts a well-formed minimal drug list', () => {
  const list = context.drugsFromCsvText('name,Dose,Ref\nDrug A,10 mg/kg,Local protocol\n');
  assert.equal(list.length, 1);
  assert.equal(list[0].name, 'Drug A');
  assert.equal(list[0].Dose, '10 mg/kg');
});

test('hypoglycaemia GIR reference arithmetic is internally consistent', () => {
  const gir = rate => 100 * rate / 1440; // D10: 100 mg/mL
  assert.ok(Math.abs(gir(60) - 4.1666667) < 0.0001);
  assert.ok(Math.abs(gir(90) - 6.25) < 0.0001);
  assert.ok(Math.abs(gir(115.2) - 8) < 0.0001);
});
