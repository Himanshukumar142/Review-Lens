function defaultSleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function withBackoff(fn, { retries = 4, sleep = defaultSleep } = {}) {
  const delays = [1000, 2000, 4000, 8000]

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      const status = err.status
      const isRetryable = status === 429 || (status >= 500 && status <= 599)

      if (!isRetryable || attempt === retries) {
        throw err
      }

      await sleep(delays[attempt])
    }
  }
}

module.exports = { withBackoff }
