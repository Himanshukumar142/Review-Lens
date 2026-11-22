const { test } = require('node:test')
const assert = require('node:assert')
const { parseAndClean, cleanText, parseRating, hasLettersOrDigits } = require('../src/cleaning')

function makeCsv(rows) {
  const header = 'id,product,rating,review_text'
  const lines = rows.map(r => `${r.id},${r.product},${r.rating},"${r.text}"`)
  return Buffer.from([header, ...lines].join('\n'))
}

test('empty text is flagged as skipped_empty', () => {
  const csv = Buffer.from('id,product,rating,review_text\nR005,Widget Pro,3,\n')
  const results = parseAndClean(csv)
  assert.strictEqual(results[0].status, 'skipped_empty')
})

test('rating "five" becomes null', () => {
  assert.strictEqual(parseRating('five'), null)
})

test('rating "" becomes null', () => {
  assert.strictEqual(parseRating(''), null)
})

test('valid integer rating 3 is kept as 3', () => {
  assert.strictEqual(parseRating('3'), 3)
})

test('emoji-only text is flagged as skipped_no_text', () => {
  const csv = Buffer.from('id,product,rating,review_text\nR009,Gadget X,2,😡😤👎💔\n')
  const results = parseAndClean(csv)
  assert.strictEqual(results[0].status, 'skipped_no_text')
})

test('Devanagari text passes hasLettersOrDigits check', () => {
  assert.strictEqual(hasLettersOrDigits('यह उत्पाद बहुत खराब है'), true)
})

test('R012 and R015 share one hash and second is marked isDuplicate', () => {
  const rows = [
    { id: 'R012', product: 'Widget Pro', rating: '1', text: 'Worst product ever. Quality is terrible.' },
    { id: 'R015', product: 'Widget Pro', rating: '1', text: 'Worst product ever. Quality is terrible.' }
  ]
  const results = parseAndClean(makeCsv(rows))
  assert.strictEqual(results[0].hash, results[1].hash)
  assert.strictEqual(results[0].isDuplicate, false)
  assert.strictEqual(results[1].isDuplicate, true)
})

test('HTML tags are stripped by cleanText', () => {
  assert.strictEqual(cleanText('<b>Great product!</b> Good quality.'), 'Great product! Good quality.')
})
