function defaultSleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function withBackoff(fn, { retries = 3, sleep = defaultSleep } = {}) {
  const delays = [500, 1000, 2000]

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      const status = err.status
      const isRetryable = status === 429 || status === 503 || (status >= 500 && status <= 599)

      if (!isRetryable || attempt === retries) {
        throw err
      }

      await sleep(delays[attempt] || 2000)
    }
  }
}

module.exports = { withBackoff }
