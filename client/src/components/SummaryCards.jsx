import React from 'react'
import { Grid, Card, CardContent, Typography, Box, Chip } from '@mui/material'

function StatCard({ title, value, color }) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight="bold" color={color || 'text.primary'}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default function SummaryCards({ stats }) {
  const cards = [
    { title: 'Analysed', value: stats.total },
    { title: 'Positive', value: `${stats.sentimentPct.positive}%`, color: 'success.main' },
    { title: 'Neutral', value: `${stats.sentimentPct.neutral}%`, color: 'text.secondary' },
    { title: 'Negative', value: `${stats.sentimentPct.negative}%`, color: 'error.main' },
    { title: 'Needs Reply', value: stats.needsReply, color: 'warning.main' },
    { title: 'Skipped', value: stats.skipped },
    { title: 'Failed', value: stats.failed },
    { title: 'Agreement', value: stats.agreementPct !== null ? `${stats.agreementPct}%` : 'N/A' },
  ]

  return (
    <Box sx={{ mt: 1, mb: 3 }}>
      <Grid container spacing={2}>
        {cards.map(card => (
          <Grid item xs={6} sm={3} key={card.title}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>
      {stats.metrics && (
        <Box sx={{ mt: 2, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Chip label={`AI Calls: ${stats.metrics.aiCalls}`} variant="outlined" size="small" />
          <Chip label={`Served from Cache: ${stats.metrics.cachedReviews}`} variant="outlined" size="small" />
          <Chip label={`Total Time: ${(stats.metrics.durationMs / 1000).toFixed(1)}s`} variant="outlined" size="small" />
        </Box>
      )}
    </Box>
  )
}
