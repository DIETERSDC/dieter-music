// Vercel serverless proxy for tRPC - forwards requests to Manus backend
const MANUS_BACKEND = 'https://dieter-music-jnmb3nnd.manus.space';

module.exports = async function handler(req, res) {
  const path = (req.url || '').replace(/^\/api\/trpc/, '') || '';
  const targetUrl = `${MANUS_BACKEND}/api/trpc${path}`;

  try {
    const headers = { ...req.headers };
    delete headers['host'];
    delete headers['connection'];

    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.text();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(response.status);

    try {
      res.json(JSON.parse(data));
    } catch {
      res.send(data);
    }
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(502).json({ error: 'Bad Gateway', message: error.message });
  }
};
