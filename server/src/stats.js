function isMismatch(row) {
  if (!row.result || row.rating === null) return false
  return (row.rating >= 4 && row.result.sentiment === 'negative') ||
         (row.rating <= 2 && row.result.sentiment === 'positive')
}

function topTopics(rows, topN) {
  const counts = {}
  const examples = {}

  for (const row of rows) {
    for (const topic of row.result.topics) {
      counts[topic] = (counts[topic] || 0) + 1
      if (!examples[topic]) examples[topic] = row.result.summary
    }
  }

  return Object.keys(counts)
    .sort((a, b) => counts[b] - counts[a])
    .slice(0, topN)
    .map(topic => ({ topic, count: counts[topic], example: examples[topic] }))
}

function computeStats(rows) {
  const analyzed = rows.filter(r => r.result)
  const total = analyzed.length
  const sentimentCounts = { positive: 0, neutral: 0, negative: 0 }

  for (const row of analyzed) {
    sentimentCounts[row.result.sentiment]++
  }

  const pct = s => (total ? Math.round((sentimentCounts[s] / total) * 100) : 0)

  const withRating = analyzed.filter(r => r.rating !== null)
  const mismatchCount = withRating.filter(isMismatch).length
  const agreementPct = withRating.length
    ? Math.round(((withRating.length - mismatchCount) / withRating.length) * 100)
    : null

  return {
    total,
    skipped: rows.filter(r => r.status === 'skipped_empty' || r.status === 'skipped_no_text').length,
    failed: rows.filter(r => r.status === 'analysis_failed').length,
    sentimentCounts,
    sentimentPct: { positive: pct('positive'), neutral: pct('neutral'), negative: pct('negative') },
    needsReply: analyzed.filter(r => r.result.needs_reply).length,
    topComplaints: topTopics(analyzed.filter(r => r.result.sentiment === 'negative'), 3),
    topPraises: topTopics(analyzed.filter(r => r.result.sentiment === 'positive'), 3),
    mismatchCount,
    agreementPct
  }
}

module.exports = { computeStats, isMismatch }
