// src/services/igdbService.js
// Integração oficial com a API da IGDB (Internet Game Database - Twitch API)
// Documentação: https://api-docs.igdb.com/#requests

const IGDB_CLIENT_ID = import.meta.env.VITE_IGDB_CLIENT_ID || '';
const IGDB_ACCESS_TOKEN = import.meta.env.VITE_IGDB_ACCESS_TOKEN || '';

/**
 * Converte um image_id da IGDB em URL HD de imagem
 * Tamanhos disponíveis: t_cover_small, t_cover_big, t_720p, t_1080p
 */
export function getIgdbImageUrl(imageId, size = 't_cover_big') {
  if (!imageId) return null;
  return `https://images.igdb.com/igdb/image/upload/${size}/${imageId}.jpg`;
}

/**
 * Busca a capa de um jogo diretamente na API da IGDB
 * @param {string} gameQuery - Nome do jogo ou franquia
 * @param {AbortSignal} signal - Signal para cancelamento de requisição
 * @returns {Promise<string|null>} - URL da capa ou null
 */
export async function fetchIgdbCover(gameQuery, signal) {
  if (!gameQuery || !IGDB_CLIENT_ID || !IGDB_ACCESS_TOKEN) {
    return null;
  }

  try {
    const cleanQuery = gameQuery.replace(/["\\]/g, '').trim();
    if (!cleanQuery) return null;

    const body = `search "${cleanQuery}"; fields name, cover.image_id; limit 1;`;

    const res = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': IGDB_CLIENT_ID,
        'Authorization': `Bearer ${IGDB_ACCESS_TOKEN}`,
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
      },
      body,
      signal,
    });

    if (!res.ok) return null;
    const data = await res.json();

    if (Array.isArray(data) && data.length > 0 && data[0].cover?.image_id) {
      return getIgdbImageUrl(data[0].cover.image_id, 't_cover_big');
    }
  } catch (err) {
    if (err.name === 'AbortError') throw err;
  }

  return null;
}
