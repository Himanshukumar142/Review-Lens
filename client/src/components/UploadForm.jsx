import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

export default function UploadForm({ onUpload, loading }) {
  function handleChange(e) {
    const file = e.target.files[0]
    if (file) onUpload(file)
    e.target.value = ''
  }

  return (
    <Box
      sx={{
        border: '2px dashed #bdbdbd',
        borderRadius: 2,
        p: 5,
        textAlign: 'center',
        bgcolor: '#fafafa',
        mb: 3
      }}
    >
      <Typography variant="h6" gutterBottom>
        Upload your reviews.csv
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Columns: id, product, rating, review_text
      </Typography>
      <Button
        variant="contained"
        component="label"
        disabled={loading}
        startIcon={<CloudUploadIcon />}
        size="large"
      >
        Choose CSV File
        <input type="file" accept=".csv" hidden onChange={handleChange} />
      </Button>
    </Box>
  )
}
