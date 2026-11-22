const axios = require('axios')

async function callGemini(systemPrompt, userMessage) {
  const model = process.env.GEMINI_MODEL
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`

  try {
    const response = await axios.post(
      url,
      {
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        generationConfig: { temperature: 0, responseMimeType: 'application/json' }
      },
      { headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY } }
    )
    return response.data.candidates[0].content.parts[0].text
  } catch (err) {
    const error = new Error('Gemini request failed')
    error.status = err.response?.status
    throw error
  }
}

module.exports = { callGemini }
