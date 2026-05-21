const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

async function supabase(path, method = 'GET', body = null) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'return=representation' : '',
    },
    body: body ? JSON.stringify(body) : null,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // GET /api/logs?date=2025-05-21  or  GET /api/logs (all)
    if (req.method === 'GET') {
      const { date } = req.query;
      const filter = date ? `date=eq.${date}&` : '';
      const data = await supabase(`logs?${filter}select=*&order=created_at.asc`);
      return res.status(200).json(data);
    }

    // POST /api/logs  { user_id, date, count, logged_at }
    if (req.method === 'POST') {
      const { user_id, date, count, logged_at } = req.body;
      const data = await supabase('logs', 'POST', { user_id, date, count, logged_at });
      return res.status(200).json(data?.[0]);
    }

    // DELETE /api/logs?id=123
    if (req.method === 'DELETE') {
      const { id } = req.query;
      await supabase(`logs?id=eq.${id}`, 'DELETE');
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
