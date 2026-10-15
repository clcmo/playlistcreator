import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const { DEEZER_APP_ID, DEEZER_APP_SECRET, ALLOWED_ORIGIN, PORT = 8787 } = process.env;
const app = express();
app.use(cors({ origin: ALLOWED_ORIGIN }));

// Troca o código OAuth do Deezer por token (precisa do secret, por isso fica aqui).
app.get('/auth/deezer/token', async (req, res) => {
  const p = new URLSearchParams({
    app_id: DEEZER_APP_ID, secret: DEEZER_APP_SECRET, code: String(req.query.code), output: 'json'
  });
  const r = await fetch(`https://connect.deezer.com/oauth/access_token.php?${p}`);
  const body = await r.json().catch(() => ({}));
  res.status(r.ok ? 200 : 502).json(body);
});

// Proxy fino da API do Deezer (que não envia CORS). Só repassa o token do próprio usuário.
app.all('/api/deezer/*', async (req, res) => {
  const path = req.params[0];
  const url = new URL(`https://api.deezer.com/${path}`);
  for (const [k, v] of Object.entries(req.query)) url.searchParams.set(k, String(v));
  const token = req.header('x-deezer-token');
  if (token) url.searchParams.set('access_token', token);
  const r = await fetch(url, { method: req.method });
  res.status(r.status).json(await r.json().catch(() => ({})));
});

app.listen(PORT, () => console.log(`BFF em :${PORT}`));
