const ORIGIN = 'http://2.25.141.39';

export default async function handler(req, res) {
  const { station, id } = req.query;
  try {
    const upstream = await fetch(
      `${ORIGIN}/api/station/${encodeURIComponent(station || 'underplayradio')}/art/${encodeURIComponent(id || '')}`
    );
    if (!upstream.ok) {
      res.status(upstream.status);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ success: false }));
      return;
    }
    const bytes = Buffer.from(await upstream.arrayBuffer());
    res.status(200);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(bytes);
  } catch (erro) {
    res.status(502);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ success: false, error: String(erro) }));
  }
}
