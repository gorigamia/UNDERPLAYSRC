// src/services/coverArtService.js
import { findGameCover, extractGameAndComposer } from './gameCoversDatabase.js';
import { fetchIgdbCover } from './igdbService.js';

export const DEFAULT_COVER_URL = '/assets/fallback-cover.jpg';

/**
 * Remove sufixos como (feat. ...), [Remix], - Radio Edit, etc. para melhorar a busca
 */
function cleanString(str) {
  if (!str) return '';
  return str
    .replace(/\s*[\(\[](feat|ft|remix|radio edit|official|audio|video|mix|deluxe|version|prod\.).*?[\)\]]/gi, '')
    .trim();
}

/**
 * Detecta se a string contém caracteres não-Latinas significativos
 * (árabe, chinês, japonês, russo, tailandês, etc.)
 */
const NON_LATIN_RANGE_RE = /[\u0600-\u06FF\u0400-\u04FF\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF\u0E00-\u0E7F]/;

function hasNonLatinChars(str) {
  if (!str) return false;
  return NON_LATIN_RANGE_RE.test(str);
}

/**
 * Remove caracteres não-ASCII problemáticos para APIs de busca,
 * mantendo apenas letras latinas, números e pontuação básica.
 * Para strings com caracteres não-Latinas, retorna a string original
 * (as APIs de busca lidam melhor com o original do que com lixo).
 */
function sanitizeForApi(str) {
  if (!str) return '';
  // Se tem caracteres não-Latinas, mantém como está (APIs aceitam UTF-8)
  if (hasNonLatinChars(str)) return str.trim();
  // Para strings Latinas, remove lixo
  return str
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, '')
    .replace(/[\u2600-\u27BF]/gu, '')
    .replace(/[\uFE00-\uFE0F]/gu, '')
    .replace(/[\u200B-\u200D\uFEFF]/gu, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function isGenericArtist(artist) {
  if (!artist) return true;
  const a = artist.toLowerCase().trim();
  return a === 'unknown' || a === 'unknown artist' || a === 'underplay' || a === 'underplay radio' || a === 'radio';
}

/**
 * 1. API Primária: iTunes Search API
 */
async function fetchItunes(artist, title, signal) {
  try {
    const term = artist ? `${artist} ${title}` : title;
    if (!term || term.trim() === '') return null;
    const query = encodeURIComponent(term.trim());
    const res = await fetch(`https://itunes.apple.com/search?term=${query}&entity=song&limit=1`, { signal });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.results && data.results.length > 0 && data.results[0].artworkUrl100) {
      return data.results[0].artworkUrl100.replace('100x100bb', '600x600bb');
    }
  } catch (err) {
    if (err.name === 'AbortError') throw err;
  }
  return null;
}

/**
 * 2. API Secundária: Deezer Search API (usando JSONP para evitar qualquer problema de CORS)
 */
function fetchDeezerJSONP(artist, title, timeoutMs = 3500) {
  return new Promise((resolve) => {
    const term = artist ? `${artist} ${title}` : title;
    if (!term || term.trim() === '') return resolve(null);
    const callbackName = `__deezer_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    const query = encodeURIComponent(term.trim());
    const script = document.createElement('script');
    let timer = null;

    const cleanup = () => {
      if (timer) clearTimeout(timer);
      delete window[callbackName];
      if (script.parentNode) script.parentNode.removeChild(script);
    };

    timer = setTimeout(() => {
      cleanup();
      resolve(null);
    }, timeoutMs);

    window[callbackName] = (data) => {
      cleanup();
      if (data?.data?.[0]?.album) {
        const album = data.data[0].album;
        const cover = album.cover_xl || album.cover_big || album.cover_medium;
        if (cover) return resolve(cover);
      }
      resolve(null);
    };

    script.src = `https://api.deezer.com/search?q=${query}&limit=1&output=jsonp&callback=${callbackName}`;
    script.onerror = () => {
      cleanup();
      resolve(null);
    };
    document.head.appendChild(script);
  });
}

/**
 * 2b. Deezer Direct Fetch (fallback quando JSONP não resolver)
 */
async function fetchDeezerFetch(artist, title, signal) {
  try {
    const term = artist ? `${artist} ${title}` : title;
    if (!term || term.trim() === '') return null;
    const query = encodeURIComponent(term.trim());
    const res = await fetch(`https://api.deezer.com/search?q=${query}&limit=1`, { signal });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.data?.[0]?.album) {
      const album = data.data[0].album;
      return album.cover_xl || album.cover_big || album.cover_medium || null;
    }
  } catch {
    // Falha silenciosa
  }
  return null;
}

/**
 * 3. API Terciária: MusicBrainz + Cover Art Archive
 */
async function fetchMusicBrainz(artist, title, signal) {
  try {
    const queryStr = artist ? `artist:${artist} AND release:${title}` : `release:${title}`;
    const query = encodeURIComponent(queryStr);
    const res = await fetch(`https://musicbrainz.org/ws/2/release/?query=${query}&fmt=json&limit=1`, {
      signal,
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const releaseId = data.releases?.[0]?.id;
    if (releaseId) {
      const caRes = await fetch(`https://coverartarchive.org/release/${releaseId}`, { signal });
      if (caRes.ok) {
        const caData = await caRes.json();
        const img = caData.images?.[0]?.thumbnails?.['500'] || caData.images?.[0]?.image;
        if (img) return img;
      }
    }
  } catch (err) {
    if (err.name === 'AbortError') throw err;
  }
  return null;
}

/**
 * 4. API Quaternária: TheAudioDB
 */
async function fetchTheAudioDB(artist, title, signal) {
  try {
    const s = encodeURIComponent(artist || '');
    const t = encodeURIComponent(title || '');
    const url = artist
      ? `https://www.theaudiodb.com/api/v1/json/2/searchtrack.php?s=${s}&t=${t}`
      : `https://www.theaudiodb.com/api/v1/json/2/searchtrack.php?t=${t}`;
    const res = await fetch(url, { signal });
    if (!res.ok) return null;
    const data = await res.json();
    const track = data.track?.[0];
    if (track?.strTrackThumb || track?.strAlbumThumb) {
      return track.strTrackThumb || track.strAlbumThumb;
    }
  } catch (err) {
    if (err.name === 'AbortError') throw err;
  }
  return null;
}

/**
 * Sistema Waterfall de busca de capas (resolve pela primeira que encontrar)
 */
export async function getCoverArt(artist, title, album, signal) {
  // Trata caso o 3º argumento seja o signal de abort
  if (album && typeof album === 'object' && album instanceof AbortSignal) {
    signal = album;
    album = null;
  }

  if (!artist && !title && !album) return null;
  const cleanTitle = cleanString(title);
  const cleanArtist = cleanString(artist);
  const cleanAlbum = cleanString(album);

  // Sanitiza para APIs (mantém original se tiver caracteres não-Latinas)
  const apiTitle = sanitizeForApi(cleanTitle || title);
  const apiArtist = sanitizeForApi(cleanArtist || artist);
  const apiAlbum = sanitizeForApi(cleanAlbum || album);

  // Verifica se é busca com caracteres especiais (Ásia/RTL)
  const isSpecialCharSearch = hasNonLatinChars(title) || hasNonLatinChars(artist);

  // 0. Verifica primeiro no Banco de Dados Curado de Games & Soundtracks
  let gameCover = findGameCover(artist, title) || findGameCover(cleanArtist, cleanTitle);
  if (gameCover) return gameCover;

  if (album) {
    gameCover = findGameCover(artist, album) || findGameCover(cleanArtist, cleanAlbum);
    if (gameCover) return gameCover;
  }

  // 0b. Se um jogo ou compositor foi detectado na tag (ex: [Super Mario 64] ou Koji Kondo), busca a OST oficial na web
  const { game, composer } = extractGameAndComposer(artist, `${title || ''} ${album || ''}`);
  const targetGame = game || cleanAlbum;
  if (targetGame) {
    // Tenta primeiro a API oficial da IGDB (se configurada)
    const igdbCover = await fetchIgdbCover(targetGame, signal);
    if (igdbCover) return igdbCover;

    let ostCover = await fetchItunes(composer || apiArtist || artist || '', `${targetGame} Soundtrack`, signal);
    if (ostCover) return ostCover;

    ostCover = await fetchItunes(composer || apiArtist || artist || '', `${targetGame} OST`, signal);
    if (ostCover) return ostCover;

    ostCover = await fetchDeezerJSONP(composer || apiArtist || artist || '', `${targetGame} Soundtrack`);
    if (ostCover) return ostCover;

    ostCover = await fetchMusicBrainz(composer || apiArtist || artist || '', targetGame, signal);
    if (ostCover) return ostCover;
  }

  // 1. Tenta iTunes (artista + título exato)
  let cover = await fetchItunes(apiArtist || apiTitle, apiTitle || apiArtist, signal);
  if (cover) return cover;

  // 1b. Tenta iTunes (nome limpo sem feat/remix)
  if (cleanTitle !== title || cleanArtist !== artist) {
    cover = await fetchItunes(apiArtist || '', apiTitle || '', signal);
    if (cover) return cover;
  }

  // 1c. Tenta iTunes pelo Álbum
  if (apiAlbum) {
    cover = await fetchItunes(apiArtist || artist || '', apiAlbum, signal);
    if (cover) return cover;
  }

  // 1d. Tenta iTunes (apenas pelo título, SOMENTE SE não houver artista conhecido)
  if (isGenericArtist(artist) && apiTitle) {
    cover = await fetchItunes('', apiTitle, signal);
    if (cover) return cover;
  }

  // 1e. Para caracteres especiais: tenta só com o título original (APIs lidam melhor)
  if (isSpecialCharSearch && apiTitle && apiTitle !== title) {
    cover = await fetchItunes(apiArtist || '', title, signal);
    if (cover) return cover;
  }

  // 2. Tenta MusicBrainz + Cover Art Archive (por faixa e por álbum)
  cover = await fetchMusicBrainz(apiArtist || artist, apiTitle || title, signal);
  if (cover) return cover;

  if (apiAlbum) {
    cover = await fetchMusicBrainz(apiArtist || artist, apiAlbum, signal);
    if (cover) return cover;
  }

  // O player aplica DEFAULT_COVER_URL quando todas as fontes falham.
  return null;
}
