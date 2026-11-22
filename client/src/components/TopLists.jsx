import React from 'react'
import { Grid, Card, CardContent, Typography, Box, Chip } from '@mui/material'

function TopList({ title, items, chipColor }) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {items.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            Not enough data yet
          </Typography>
        )}
        {items.map(item => (
          <Box key={item.topic} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Chip label={item.topic} color={chipColor} size="small" />
              <Typography variant="caption" color="text.secondary">
                {item.count} review{item.count !== 1 ? 's' : ''}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              "{item.example}"
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  )
}

export default function TopLists({ stats }) {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6}>
        <TopList title="Top Complaints" items={stats.topComplaints} chipColor="error" />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TopList title="Top Praises" items={stats.topPraises} chipColor="success" />
      </Grid>
    </Grid>
  )
}
