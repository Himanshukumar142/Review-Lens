const SENTIMENTS = ['positive', 'neutral', 'negative']
const TOPICS = ['quality', 'delivery', 'price', 'packaging', 'support', 'size_fit', 'other']

function isValidResult(obj) {
  if (!obj || typeof obj !== 'object') return false
  if (!SENTIMENTS.includes(obj.sentiment)) return false
  if (!Array.isArray(obj.topics) || obj.topics.length === 0) return false
  if (!obj.topics.every(t => TOPICS.includes(t))) return false
  if (typeof obj.summary !== 'string' || obj.summary.trim().length === 0) return false
  if (typeof obj.needs_reply !== 'boolean') return false
  return true
}

module.exports = { isValidResult, SENTIMENTS, TOPICS }
