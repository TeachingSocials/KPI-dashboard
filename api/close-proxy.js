export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { endpoint, method = 'GET', apiKey, params } = req.body

  const ALLOWED = [
    'activity/', 'lead/', 'opportunity/', 'pipeline/', 'user/', 'me/',
    'status/lead/', 'custom_activity_type/', 'custom_field/',
    'lead_status/', 'contact/', 'sequence/', 'smart_view/'
  ]

  const allowed = ALLOWED.some(a => endpoint?.startsWith(a) || endpoint === a.replace('/',''))
  if (!allowed) return res.status(404).json({ error: 'The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again.' })

  try {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    const url = `https://api.close.com/api/v1/${endpoint}${qs}`
    const resp = await fetch(url, {
      method,
      headers: {
        'Authorization': 'Basic ' + Buffer.from(apiKey + ':').toString('base64'),
        'Content-Type': 'application/json'
      }
    })
    const data = await resp.json()
    return res.status(resp.status).json(data)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
