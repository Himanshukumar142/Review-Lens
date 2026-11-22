const { parse } = require('csv-parse/sync')
const crypto = require('crypto')

function cleanText(raw) {
  return raw
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseRating(raw) {
  const num = Number(raw)
  if (Number.isInteger(num) && num >= 1 && num <= 5) return num
  return null
}

function hasLettersOrDigits(text) {
  return /[\p{L}\p{N}]/u.test(text)
}

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex')
}

function buildRow(row, text, rating, seenHashes) {
  const base = { id: row.id, product: row.product, rating, text }

  if (text.length === 0) {
    return { ...base, hash: null, status: 'skipped_empty', isDuplicate: false }
  }

  if (!hasLettersOrDigits(text)) {
    return { ...base, hash: null, status: 'skipped_no_text', isDuplicate: false }
  }

  const hash = sha256(text.toLowerCase())
  const isDuplicate = seenHashes.has(hash)
  seenHashes.add(hash)
  return { ...base, hash, status: 'ok', isDuplicate }
}

function parseAndClean(csvBuffer) {
  let rows
  try {
    rows = parse(csvBuffer, {
      columns: true,
      skip_empty_lines: true,
      bom: true,
      relax_column_count: true
    })
  } catch (err) {
    throw new Error('CSV parse error: ' + err.message)
  }

  const seenHashes = new Set()
  return rows.map(row => {
    const text = cleanText(row.review_text || '')
    const rating = parseRating(row.rating || '')
    return buildRow(row, text, rating, seenHashes)
  })
}

module.exports = { parseAndClean, cleanText, parseRating, hasLettersOrDigits, sha256 }
