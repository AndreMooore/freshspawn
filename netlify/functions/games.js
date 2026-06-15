// Serverless proxy for the RAWG API. Keeps your API key secret (server-side only).
// Set RAWG_API_KEY in Netlify: Site settings -> Environment variables.
exports.handler = async (event) => {
  const headers = {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
    'cache-control': 'public, max-age=300'
  };
  const KEY = process.env.RAWG_API_KEY;
  if (!KEY) {
    return { statusCode: 500, headers,
      body: JSON.stringify({ error: 'RAWG_API_KEY environment variable is not set.' }) };
  }
  const p = event.queryStringParameters || {};
  let path = (p.path || 'games').replace(/[^a-zA-Z0-9/_-]/g, '');
  if (!path.startsWith('games')) path = 'games';     // only allow the games endpoints
  const qs = new URLSearchParams();
  for (const k in p) { if (k !== 'path') qs.append(k, p[k]); }
  qs.append('key', KEY);
  const url = 'https://api.rawg.io/api/' + path + '?' + qs.toString();
  try {
    const r = await fetch(url);                       // Node 18+ has global fetch on Netlify
    const body = await r.text();
    return { statusCode: r.status, headers, body };
  } catch (e) {
    return { statusCode: 502, headers, body: JSON.stringify({ error: String(e) }) };
  }
};
