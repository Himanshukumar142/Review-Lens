import React from 'react'
import { Card, CardContent, Typography, Box, Button, CircularProgress, Alert } from '@mui/material'

export default function ReplyBox({ reply, loading, error, onClose }) {
  if (!reply && !loading && !error) return null

  return (
    <Card variant="outlined" sx={{ mb: 3, bgcolor: '#fbfbfb' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">Suggested Reply</Typography>
          <Button size="small" onClick={onClose}>Close</Button>
        </Box>
        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={24} />
            <Typography variant="body2">Generating reply...</Typography>
          </Box>
        )}
        {error && <Alert severity="error">{error}</Alert>}
        {reply && (
          <Typography variant="body1" sx={{ mt: 1 }}>
            {reply}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
