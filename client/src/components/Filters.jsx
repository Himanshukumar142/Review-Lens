import React from 'react'
import { Box, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material'

const sentiments = ['all', 'positive', 'neutral', 'negative']
const topics = ['all', 'quality', 'delivery', 'price', 'packaging', 'support', 'size_fit', 'other']

export default function Filters({
  products,
  filterProduct, setFilterProduct,
  filterSentiment, setFilterSentiment,
  filterTopic, setFilterTopic,
  filterNeedsReply, setFilterNeedsReply
}) {
  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3, alignItems: 'center' }}>
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Product</InputLabel>
        <Select value={filterProduct} label="Product" onChange={e => setFilterProduct(e.target.value)}>
          {products.map(p => (
            <MenuItem key={p} value={p}>{p === 'all' ? 'All Products' : p}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Sentiment</InputLabel>
        <Select value={filterSentiment} label="Sentiment" onChange={e => setFilterSentiment(e.target.value)}>
          {sentiments.map(s => (
            <MenuItem key={s} value={s}>{s === 'all' ? 'All Sentiments' : s}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Topic</InputLabel>
        <Select value={filterTopic} label="Topic" onChange={e => setFilterTopic(e.target.value)}>
          {topics.map(t => (
            <MenuItem key={t} value={t}>{t === 'all' ? 'All Topics' : t}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant={filterNeedsReply ? 'contained' : 'outlined'}
        color="warning"
        onClick={() => setFilterNeedsReply(!filterNeedsReply)}
      >
        Needs Reply Only
      </Button>
    </Box>
  )
}
