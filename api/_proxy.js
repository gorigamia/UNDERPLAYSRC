const ORIGIN = 'http://2.25.141.39';

export function baseUrl(req) {
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'www.underplay.com.br';
  return `https://${host}`;
}

export async function proxy(req, res, path, options = {}) {
  try {
    const upstream = await fetch(`${ORIGIN}${path}`, {
      method: options.method || 'GET',
      headers: { 'User-Agent': 'UnderplayRadio/1.0', ...(options.headers || {}) },
    });
    const texto = await upstream.text();
    const base = baseUrl(req);
    res.status(upstream.status);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(texto.split(ORIGIN).join(base).split('http://2.25.141.39').join(base));
  } catch (erro) {
    res.status(502);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ success: false, message: 'Erro ao consultar a rádio.', error: String(erro) }));
  }
}
