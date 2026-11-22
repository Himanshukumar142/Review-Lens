const { test } = require('node:test')
const assert = require('node:assert')
const { withBackoff } = require('../src/backoff')

const fakeSleep = async () => {}

test('retries twice on 429 then succeeds on third attempt', async () => {
  let callCount = 0

  const fn = async () => {
    callCount++
    if (callCount < 3) {
      const err = new Error('rate limited')
      err.status = 429
      throw err
    }
    return 'success'
  }

  const result = await withBackoff(fn, { sleep: fakeSleep })
  assert.strictEqual(result, 'success')
  assert.strictEqual(callCount, 3)
})

test('does not retry on 401 and throws immediately', async () => {
  let callCount = 0

  const fn = async () => {
    callCount++
    const err = new Error('unauthorized')
    err.status = 401
    throw err
  }

  await assert.rejects(
    () => withBackoff(fn, { sleep: fakeSleep }),
    err => err.status === 401
  )
  assert.strictEqual(callCount, 1)
})
