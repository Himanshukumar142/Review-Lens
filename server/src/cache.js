const fs = require('fs')
const path = require('path')

const CACHE_PATH = path.join(__dirname, '..', 'cache.json')

function readCache() {
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'))
  } catch {
    return {}
  }
}

function getCached(hash) {
  return readCache()[hash] || null
}

function setCached(hash, result) {
  const cache = readCache()
  cache[hash] = result
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2))
}

module.exports = { getCached, setCached }
