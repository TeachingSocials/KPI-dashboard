export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { endpoint, method = 'GET', apiKey, body: reqBody } = req.body;

  const ALLOWED_PREFIXES = [
    'activity/', 'lead/', 'opportunity/', 'pipeline/', 'user/', 'me/',
    'status/lead/', 'status/opportunity/',
    'custom_activity_type/', 'custom_field/', 'custom_field_schema/',
    'contact/', 'sequence/', 'smart_view/', 'report/'
  ];

  const isAllowed = ALLOWED_PREFIXES.some(p => endpoint?.startsWith(p));
  if (!isAllowed) {
    return res.status(404).json({ error: 'The requested URL was not found on the server.' });
  }

  try {
    const url = `https://api.close.com/api/v1/${endpoint}`;
    const fetchOptions = {
      method,
      headers: {
        'Authorization': 'Basic ' + Buffer.from(apiKey + ':').toString('base64'),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    if (reqBody && method !== 'GET') fetchOptions.body = JSON.stringify(reqBody);
    const response = await fetch(url, fetchOptions);
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
