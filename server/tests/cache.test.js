const { test } = require('node:test')
const assert = require('node:assert')
const { getCached, setCached } = require('../src/cache')
const { analyzeReviews } = require('../src/analyzer')

test('getCached returns null for an unknown hash', () => {
  assert.strictEqual(getCached('totally_unknown_hash_xyz_000'), null)
})

test('setCached then getCached returns the stored result', () => {
  const hash = 'round_trip_test_' + Date.now()
  const result = { id: 'R001', sentiment: 'positive', topics: ['quality'], summary: 'Good.', needs_reply: false }
  setCached(hash, result)
  assert.deepStrictEqual(getCached(hash), result)
})

test('second analyzeReviews call makes zero LLM calls when results are cached', async () => {
  const uniqueHash = 'cache_zero_calls_' + Date.now()
  let llmCallCount = 0

  const mockLlm = async () => {
    llmCallCount++
    return JSON.stringify({
      results: [{ id: 'CTEST', sentiment: 'positive', topics: ['quality'], summary: 'Good product.', needs_reply: false }]
    })
  }

  const rows = [{ id: 'CTEST', product: 'Widget', rating: 5, text: 'Good product', hash: uniqueHash, status: 'ok', isDuplicate: false }]

  await analyzeReviews(rows, mockLlm, 0)
  assert.strictEqual(llmCallCount, 1)

  await analyzeReviews(rows, mockLlm, 0)
  assert.strictEqual(llmCallCount, 1)
})
