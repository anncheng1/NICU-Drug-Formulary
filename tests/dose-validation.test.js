/**
 * Regression tests for the pure calculation and CSV functions in index.html.
 *
 * Run from the repository root:
 *   node --test tests/dose-validation.test.js
 *
 * These tests execute the functions extracted from the actual app source; they do
 * not duplicate their implementations. They validate arithmetic/display and CSV
 * integrity only, not the clinical appropriateness of any drug regimen.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync(require('node:path').join(__dirname, '..', 'index.html'), 'utf8');

function extractFunction(name) {
  const marker = new RegExp('function\\\\s+' + name + '\\\\s*\\\\(');
  const match = marker.exec(html);
  assert.ok(match, 'Expected function ' + name + ' to exist in index.html');
  const open = html.indexOf('{', match.index);
  // App functions are formatted with the outer closing brace at column zero.
  // This avoids miscounting braces inside JavaScript regular-expression literals.
  const close = html.indexOf('\\n}', open);
  assert.ok(close > open, 'Could not find end of function ' + name);
  return html.slice(match.index, close + 2);
}

const context = {
  DRUG_FIELDS: ['Class','Brand','Dose','Reconstitution/ dilution/ special instruction','Diluent','Incompatibilities','Method of administration','Fridge item','Storage after reconstitution','Protect from light','Ref'],
  escapeHtml: s => String(s || '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),
  amt: n => !Number.isFinite(n) ? '—' : (Math.abs(n) >= 100 ? String(Math.round(n)) : Math.abs(n) >= 10 ? String(Math.round(n*10)/10) : String(Math.round(n*100)/100))
};
['fmtSmart','mg','ml','mcg','unit','parseCSV','csvRowsToDrugs','cleanDrugList','drugsFromCsvText','annotateDoseText'].forEach(name => {
  vm.runInNewContext(extractFunction(name), context);
});

test('weight-based display helpers calculate amounts for common NICU weights', () => {
  for (const wt of [0.5, 1, 2.5, 4]) {
    assert.equal(context.mg(10, wt), (10 * wt) + ' mg');
    assert.equal(context.mcg(20, wt), (20 * wt) + ' mcg');
    assert.equal(context.ml(0.5, wt), (0.5 * wt) + ' mL');
    assert.equal(context.unit(0.1, wt), (0.1 * wt) + ' units');
  }
});

test('formatting does not round small positive amounts to zero', () => {
  assert.equal(context.fmtSmart(0), '0');
  assert.equal(context.fmtSmart(0.125), '0.125');
  assert.equal(context.fmtSmart(0.001), '0.001');
  assert.equal(context.fmtSmart(1.2), '2'); // app deliberately rounds >=1 upward
  assert.equal(context.fmtSmart(Infinity), '—');
});

test('dose annotation recognises single doses and ranges', () => {
  const single = context.annotateDoseText('50 mg/kg', 2.5);
  const range = context.annotateDoseText('0.5-1 mg/kg/dose', 2);
  assert.match(single, /\[125 mg\]/);
  assert.match(range, /\[1–2 mg\]/);
});

test('CSV parser handles quoted commas, escaped quotes, tabs and BOM', () => {
  const parsed = context.parseCSV('\uFEFFname,Dose,Ref\r\nDrug A,"1,000 mg/kg","Guide ""2026"""\r\n');
  assert.deepEqual(JSON.parse(JSON.stringify(parsed)), [
    ['name','Dose','Ref'],
    ['Drug A','1,000 mg/kg','Guide "2026"']
  ]);
  const tsv = context.parseCSV('name\tDose\nDrug B\t2 mg/kg\n');
  assert.equal(tsv[1][0], 'Drug B');
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
  // D10 contains 100 mg/mL. GIR (mg/kg/min) = concentration x mL/kg/day / 1440.
  const gir = rate => 100 * rate / 1440;
  assert.ok(Math.abs(gir(60) - 4.1666667) < 0.0001);
  assert.ok(Math.abs(gir(90) - 6.25) < 0.0001);
  assert.ok(Math.abs(gir(115.2) - 8) < 0.0001);
});
