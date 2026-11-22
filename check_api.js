require('./server/node_modules/dotenv').config({ override: true })
const axios = require('./server/node_modules/axios')

const key = process.env.GEMINI_API_KEY
const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash'

console.log(`\nTesting Gemini API connection (Model: ${model})...`)

async function test() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
    const response = await axios.post(
      url,
      { contents: [{ role: 'user', parts: [{ text: 'Say exactly: OK' }] }] },
      { headers: { 'x-goog-api-key': key } }
    )
    const text = response.data.candidates[0].content.parts[0].text
    console.log('\n✅ SUCCESS! Gemini responded:', text.trim())
  } catch (err) {
    console.log(`\n❌ FAILED (Status: ${err.response?.status || 'NO_RESPONSE'})`)
    console.log('Reason:', err.response?.data?.error?.message || err.message)
  }
}

test()
