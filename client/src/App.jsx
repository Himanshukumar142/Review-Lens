import React, { useState } from 'react'
import axios from 'axios'
import { Container, Typography, Alert, CircularProgress, Box } from '@mui/material'
import UploadForm from './components/UploadForm'
import SummaryCards from './components/SummaryCards'
import TopLists from './components/TopLists'
import Filters from './components/Filters'
import ReviewTable from './components/ReviewTable'
import ReplyBox from './components/ReplyBox'

export default function App() {
  const [rows, setRows] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [reply, setReply] = useState(null)
  const [replyLoading, setReplyLoading] = useState(false)
  const [replyError, setReplyError] = useState(null)
  const [filterProduct, setFilterProduct] = useState('all')
  const [filterSentiment, setFilterSentiment] = useState('all')
  const [filterTopic, setFilterTopic] = useState('all')
  const [filterNeedsReply, setFilterNeedsReply] = useState(false)

  async function handleUpload(file) {
    setLoading(true)
    setError(null)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const response = await axios.post('/api/analyze', formData)
      setRows(response.data.rows)
      setStats(response.data.stats)
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSuggestReply(text) {
    setReplyLoading(true)
    setReplyError(null)
    setReply(null)
    try {
      const response = await axios.post('/api/reply', { text })
      setReply(response.data.reply)
    } catch (err) {
      setReplyError(err.response?.data?.error || 'Failed to suggest reply.')
    } finally {
      setReplyLoading(false)
    }
  }

  const products = ['all', ...new Set(rows.map(r => r.product).filter(Boolean))]

  const filteredRows = rows.filter(r => {
    if (filterProduct !== 'all' && r.product !== filterProduct) return false
    if (filterSentiment !== 'all' && r.result?.sentiment !== filterSentiment) return false
    if (filterTopic !== 'all' && !r.result?.topics?.includes(filterTopic)) return false
    if (filterNeedsReply && !r.result?.needs_reply) return false
    return true
  })

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        ReviewLens
      </Typography>
      <UploadForm onUpload={handleUpload} loading={loading} />
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {stats && stats.total === 0 && stats.failed > 0 && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          All reviews failed analysis. Please check your GEMINI_API_KEY in .env and restart the server.
        </Alert>
      )}
      {stats && <SummaryCards stats={stats} />}
      {stats && <TopLists stats={stats} />}
      {stats && (
        <ReplyBox
          reply={reply}
          loading={replyLoading}
          error={replyError}
          onClose={() => setReply(null)}
        />
      )}
      {stats && (
        <Filters
          products={products}
          filterProduct={filterProduct} setFilterProduct={setFilterProduct}
          filterSentiment={filterSentiment} setFilterSentiment={setFilterSentiment}
          filterTopic={filterTopic} setFilterTopic={setFilterTopic}
          filterNeedsReply={filterNeedsReply} setFilterNeedsReply={setFilterNeedsReply}
        />
      )}
      {stats && <ReviewTable rows={filteredRows} onSuggestReply={handleSuggestReply} />}
    </Container>
  )
}
