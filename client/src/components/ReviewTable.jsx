import React from 'react'
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  Chip, Button, Box, Typography
} from '@mui/material'

function sentimentColor(s) {
  if (s === 'positive') return 'success'
  if (s === 'negative') return 'error'
  return 'default'
}

export default function ReviewTable({ rows, onSuggestReply }) {
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Review</TableCell>
            <TableCell>Sentiment</TableCell>
            <TableCell>Topics</TableCell>
            <TableCell>Summary</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.product}</TableCell>
              <TableCell>{row.rating ?? '-'}</TableCell>
              <TableCell sx={{ maxWidth: 280 }}>
                <Typography variant="body2">{row.text || '(empty)'}</Typography>
                {row.isDuplicate && <Chip label="duplicate" size="small" sx={{ mr: 0.5, mt: 0.5 }} />}
                {row.isMismatch && <Chip label="mismatch" color="warning" size="small" sx={{ mt: 0.5 }} />}
              </TableCell>
              <TableCell>
                {row.result ? (
                  <Chip label={row.result.sentiment} color={sentimentColor(row.result.sentiment)} size="small" />
                ) : (
                  <Chip label={row.status} size="small" variant="outlined" />
                )}
              </TableCell>
              <TableCell>
                {row.result?.topics?.map(t => (
                  <Chip key={t} label={t} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                ))}
              </TableCell>
              <TableCell sx={{ maxWidth: 220 }}>
                <Typography variant="body2">{row.result?.summary || '-'}</Typography>
              </TableCell>
              <TableCell>
                {row.result?.needs_reply && (
                  <Button size="small" variant="outlined" onClick={() => onSuggestReply(row.text)}>
                    Suggest reply
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}
