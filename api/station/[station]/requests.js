import { proxy } from '../../_proxy.js';

export default function handler(req, res) {
  const { station } = req.query;
  return proxy(req, res, `/api/station/${encodeURIComponent(station || 'underplayradio')}/requests`);
}
