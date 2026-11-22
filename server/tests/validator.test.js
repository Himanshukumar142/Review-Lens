const { test } = require('node:test')
const assert = require('node:assert')
const { isValidResult } = require('../src/validator')

const validResult = {
  id: 'R001',
  sentiment: 'positive',
  topics: ['quality'],
  summary: 'Customer loves the product quality.',
  needs_reply: false
}

test('accepts a fully valid result object', () => {
  assert.strictEqual(isValidResult(validResult), true)
})

test('rejects an invalid sentiment', () => {
  assert.strictEqual(isValidResult({ ...validResult, sentiment: 'great' }), false)
})

test('rejects an unknown topic in the topics array', () => {
  assert.strictEqual(isValidResult({ ...validResult, topics: ['quality', 'unknown_topic'] }), false)
})

test('rejects an empty topics array', () => {
  assert.strictEqual(isValidResult({ ...validResult, topics: [] }), false)
})

test('rejects needs_reply as a string instead of boolean', () => {
  assert.strictEqual(isValidResult({ ...validResult, needs_reply: 'true' }), false)
})

test('rejects a whitespace-only summary', () => {
  assert.strictEqual(isValidResult({ ...validResult, summary: '   ' }), false)
})
