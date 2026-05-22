const SUPABASE_URL = process.env.SUPABASE_URL || 'https://lhnviqsadfxpvwwmsubz.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobnZpcXNhZGZ4cHZ3d21zdWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNDQwMjYsImV4cCI6MjA5NDkyMDAyNn0.xzUOev3w-IxFB3Z5fjatYJef2VUWqJLMI8RUJT98OzM';

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const data = await supabase('users?select=*&order=created_at.asc');
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { id, name } = req.body;
      // upsert: insert or ignore if already exists
      const existing = await supabase(`users?id=eq.${id}&select=id`);
      if (existing && existing.length > 0) {
        return res.status(200).json({ id, name });
      }
      const data = await supabase('users', 'POST', { id, name });
      return res.status(200).json(data?.[0] || { id, name });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
