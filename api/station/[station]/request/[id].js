import { proxy } from '../../../_proxy.js';

export default function handler(req, res) {
  const { station, id } = req.query;
  return proxy(
    req,
    res,
    `/api/station/${encodeURIComponent(station || 'underplayradio')}/request/${encodeURIComponent(id || '')}`,
    { method: 'POST' }
  );
}
