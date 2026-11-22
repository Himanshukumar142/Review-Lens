const { buildSystemPrompt, buildUserMessage } = require('./prompt')
const { isValidResult } = require('./validator')
const { getCached, setCached } = require('./cache')
const { withBackoff } = require('./backoff')
const { callGemini } = require('./llmClient')

const BATCH_SIZE = 5
const DEFAULT_BATCH_DELAY_MS = 4000

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function callBatch(reviews, llmFn) {
  const systemPrompt = buildSystemPrompt()
  const userMessage = buildUserMessage(reviews)
  let rawText
  try {
    rawText = await withBackoff(() => llmFn(systemPrompt, userMessage))
  } catch {
    return []
  }
  try {
    const parsed = JSON.parse(rawText)
    return parsed.results || []
  } catch {
    return []
  }
}

async function analyzeReviews(cleanedRows, llmFn = callGemini, batchDelayMs = DEFAULT_BATCH_DELAY_MS) {
  const inMemoryCache = {}
  const failedHashes = new Set()

  const toAnalyze = []
  for (const row of cleanedRows) {
    if (row.status !== 'ok' || row.isDuplicate) continue
    const cached = getCached(row.hash)
    if (cached) {
      inMemoryCache[row.hash] = cached
    } else {
      toAnalyze.push(row)
    }
  }

  for (let i = 0; i < toAnalyze.length; i += BATCH_SIZE) {
    const batch = toAnalyze.slice(i, i + BATCH_SIZE)
    let batchResults = await callBatch(batch, llmFn)

    const failed = batch.filter(row => {
      const found = batchResults.find(r => r.id === row.id)
      return !found || !isValidResult(found)
    })

    if (failed.length > 0) {
      const retryResults = await callBatch(failed, llmFn)
      batchResults = [...batchResults, ...retryResults]
    }

    for (const row of batch) {
      const found = batchResults.find(r => r.id === row.id)
      if (found && isValidResult(found)) {
        setCached(row.hash, found)
        inMemoryCache[row.hash] = found
      } else {
        failedHashes.add(row.hash)
      }
    }

    if (i + BATCH_SIZE < toAnalyze.length) {
      await sleep(batchDelayMs)
    }
  }

  return cleanedRows.map(row => {
    if (row.status !== 'ok') return { ...row, result: null }
    const result = inMemoryCache[row.hash] || getCached(row.hash)
    if (result) return { ...row, result }
    if (failedHashes.has(row.hash)) return { ...row, status: 'analysis_failed', result: null }
    return { ...row, result: null }
  })
}

module.exports = { analyzeReviews }
