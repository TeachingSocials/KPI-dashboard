export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { endpoint, apiKey } = req.body;

    if (!apiKey || !endpoint) {
      return res.status(400).json({ error: 'Missing apiKey or endpoint' });
    }

    const base64Key = Buffer.from(apiKey + ':').toString('base64');

    const closeResponse = await fetch(`https://api.close.com/api/v1/${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + base64Key,
        'Content-Type': 'application/json'
      }
    });

    const data = await closeResponse.json();
    return res.status(closeResponse.status).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
