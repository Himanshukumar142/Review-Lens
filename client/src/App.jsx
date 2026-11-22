import React, { useState } from 'react'
import { Container, Typography } from '@mui/material'

export default function App() {
  const [results, setResults] = useState(null)

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        ReviewLens
      </Typography>
    </Container>
  )
}
