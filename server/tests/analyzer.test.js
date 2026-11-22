const { test } = require('node:test')
const assert = require('node:assert')
const { analyzeReviews } = require('../src/analyzer')

function makeRow(id, hash) {
  return { id, product: 'Widget', rating: 3, text: 'Some review text', hash, status: 'ok', isDuplicate: false }
}

test('invalid JSON response is retried once then review becomes analysis_failed', async () => {
  let callCount = 0

  const mockLlm = async () => {
    callCount++
    return 'this is not valid json at all'
  }

  const uniqueHash = 'invalid_json_test_' + Date.now()
  const rows = [makeRow('R_INV', uniqueHash)]
  const results = await analyzeReviews(rows, mockLlm, 0)

  assert.strictEqual(callCount, 2)
  assert.strictEqual(results[0].status, 'analysis_failed')
})

test('valid LLM response stores result and returns it', async () => {
  const uniqueHash = 'valid_response_test_' + Date.now()

  const mockLlm = async () =>
    JSON.stringify({
      results: [{ id: 'R_VAL', sentiment: 'negative', topics: ['quality'], summary: 'Bad quality.', needs_reply: true }]
    })

  const rows = [makeRow('R_VAL', uniqueHash)]
  const results = await analyzeReviews(rows, mockLlm, 0)

  assert.strictEqual(results[0].status, 'ok')
  assert.strictEqual(results[0].result.sentiment, 'negative')
  assert.strictEqual(results[0].result.needs_reply, true)
})
