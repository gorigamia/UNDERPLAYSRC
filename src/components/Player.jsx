import { useState, useEffect, useRef } from 'react';
import CoverArt from './CoverArt';
import PlayerControls from './PlayerControls';
import Waveform from './Waveform';
import { usePlayer } from '../hooks/usePlayer';
import styles from './Player.module.css';

import { DEFAULT_COVER_URL, getCoverArt } from '../services/coverArtService';

const NOWPLAYING_ENDPOINTS = [
  '/api/nowplaying/underplayradio',
  '/status-json.xsl',
];

// Converte URLs absolutas para relativas para passar pelo proxy/rewrites
function toRelativeArt(url) {
  if (!url) return url;
  try {
    const parsed = new URL(url);
    if (parsed.hostname === '2.25.141.39') return parsed.pathname + parsed.search;
    return url;
  } catch {
    return url;
  }
}

function isUsableArt(url) {
  if (!url || typeof url !== 'string') return false;
  if (/generic|default|fallback|placeholder|no[-_ ]?cover/i.test(url)) return false;
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// Separadores comuns entre artista e título na tag da rádio
const SEPARATORS = [
  / - (.+)/,       // Artist - Title
  /\s–\s(.+)/,     // Artist – Title (em dash)
  /\s—\s(.+)/,     // Artist — Title (em dash longo)
  /\s\|\s(.+)/,    // Artist | Title
  /:\s(.+)/,       // Artist: Title
];

// Detecta se o texto contém caracteres não-Latinas (árabe, chinês, japonês, russo, etc.)
const NON_LATIN_RE = /[\u0600-\u06FF\u0400-\u04FF\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF\u0E00-\u0E7F]/;

// Limpa caracteres que quebram APIs (emojis, símbolos especiais, etc.)
function sanitizeForApi(str) {
  if (!str) return '';
  return str
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, '')  // emojis
    .replace(/[\u2600-\u27BF]/gu, '')          // symbols
    .replace(/[\uFE00-\uFE0F]/gu, '')          // variation selectors
    .replace(/[\u200B-\u200D\uFEFF]/gu, '')    // zero-width chars
    .replace(/[^\p{L}\p{N}\p{Zs}.\-'&!?]/gu, ' ')  // keep only letters, numbers, spaces, basic punct
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// Verifica se uma string parece ser apenas símbolos/lixo
function isGarbageText(str) {
  if (!str) return true;
  const cleaned = str.replace(/[\s\-–—|:,./\\]/g, '');
  if (cleaned.length === 0) return true;
  const letters = cleaned.replace(/[^\p{L}]/gu, '');
  return letters.length / cleaned.length < 0.3;
}

// Tenta separar artista e título usando múltiplos separadores
function splitArtistTitle(text) {
  if (!text) return { artist: null, title: text };
  for (const sep of SEPARATORS) {
    const parts = text.split(sep);
    if (parts.length > 1) {
      const artist = parts[0].trim();
      const title = parts[1].trim();
      if (artist && title && !isGarbageText(artist)) {
        return { artist, title };
      }
    }
  }
  return { artist: null, title: text.trim() };
}

// Extrai artista, título e álbum a partir de qualquer formato de resposta de rádio (Icecast ou AzuraCast)
function parseTrackData(data) {
  if (!data) return null;

  // 1. Formato Icecast (icestats)
  if (data.icestats?.source) {
    const source = Array.isArray(data.icestats.source)
      ? (data.icestats.source.find((s) => s.listenurl?.includes('underplayradio') || s.title) || data.icestats.source[0])
      : data.icestats.source;

    if (source) {
      let artName = source.artist || null;
      let trackTitle = source.title || '';
      let albumName = null;

      // Se não tem artist direto, tenta extrair de yp_currently_playing
      if (!artName && source.yp_currently_playing) {
        const split = splitArtistTitle(source.yp_currently_playing);
        artName = split.artist;
        if (!trackTitle) trackTitle = split.title;
      }

      // Se ainda não tem artist, tenta extrair do título (formato "Artist - Title")
      if (!artName && trackTitle) {
        const split = splitArtistTitle(trackTitle);
        if (split.artist) {
          artName = split.artist;
          trackTitle = split.title;
        }
      }

      // Extrai tag de álbum se vier no formato [Album] ou (Album)
      if (trackTitle) {
        const albumMatch = trackTitle.match(/\s*\[([^\]]+)\]|\s*\(([^)]+)\)$/);
        if (albumMatch) {
          albumName = (albumMatch[1] || albumMatch[2] || '').trim();
          trackTitle = trackTitle.replace(/\s*\[([^\]]+)\]|\s*\(([^)]+)\)$/, '').trim();
        }
      }

      if (trackTitle || artName) {
        return { artist: artName, title: trackTitle || 'UNDERPLAY RADIO', album: albumName, art: null };
      }
    }
  }

  // 2. Formato AzuraCast em Array (lista de estações)
  if (Array.isArray(data) && data.length > 0) {
    const station = data.find((s) => s.station?.short_name === 'underplayradio' || s.station?.name?.toLowerCase().includes('underplay')) || data[0];
    if (station?.now_playing?.song) {
      return parseTrackData(station);
    }
  }

  // 3. Formato AzuraCast Objeto Único (now_playing)
  const song = data.now_playing?.song || data.song;
  if (song) {
    let artName = song.artist || null;
    let trackTitle = song.title || '';
    let albumName = song.album || null;

    // Se artista e título estão vazios mas song.text existe, tenta separar
    if (!artName && !trackTitle && song.text) {
      const split = splitArtistTitle(song.text);
      artName = split.artist;
      trackTitle = split.title;
    }

    // Se só o título tem conteúdo, tenta extrair artista dele também
    if (!artName && trackTitle) {
      const split = splitArtistTitle(trackTitle);
      if (split.artist) {
        artName = split.artist;
        trackTitle = split.title;
      }
    }

    // Se o título contiver [Album] ou (Album), extrai
    if (!albumName) {
      const albumMatch = trackTitle.match(/\s*\[([^\]]+)\]|\s*\(([^)]+)\)$/);
      if (albumMatch) {
        albumName = (albumMatch[1] || albumMatch[2] || '').trim();
        trackTitle = trackTitle.replace(/\s*\[([^\]]+)\]|\s*\(([^)]+)\)$/, '').trim();
      }
    }

    return {
      artist: artName,
      title: trackTitle || 'UNDERPLAY RADIO',
      album: albumName,
      art: isUsableArt(song.art) ? toRelativeArt(song.art) : null,
    };
  }

  return null;
}

// Cache global de capas para não re-buscar a mesma música
const coverCache = new Map();

async function fetchCurrentTrack() {
  for (const endpoint of NOWPLAYING_ENDPOINTS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(endpoint, { signal: controller.signal });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const parsed = parseTrackData(data);
        if (parsed && (parsed.title || parsed.artist)) return parsed;
      }
    } catch {
      // Tenta o próximo endpoint sem interromper a reprodução.
    }
  }
  return null;
}

export default function Player() {
  const {
    isPlaying,
    isFavorited,
    volume,
    togglePlay,
    toggleFavorite,
    handleVolumeChange,
    setIsPlaying,
    audioRef,
    error,
  } = usePlayer();
  const [artist, setArtist] = useState(null);
  const [title, setTitle] = useState('UNDERPLAY RADIO');
  const [album, setAlbum] = useState(null);
  const [coverUrl, setCoverUrl] = useState(DEFAULT_COVER_URL);
  const lastSongIdRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    let coverAbortController = null;

    async function updateNowPlaying() {
      if (document.hidden) return;
      try {
        const track = await fetchCurrentTrack();
        if (!isMounted || !track) return;

        const artName = track.artist || null;
        const trackTitle = track.title || 'UNDERPLAY RADIO';
        const albumName = track.album || null;

        // Inclui a arte para aceitar quando o AzuraCast a disponibiliza depois.
        const songId = `${artName || ''}|||${trackTitle || ''}|||${albumName || ''}|||${track.art || ''}`;

        // Só atualiza se a música mudou (evita piscar a capa)
        if (songId === lastSongIdRef.current) return;
        lastSongIdRef.current = songId;

        setArtist(artName);
        setTitle(trackTitle);
        setAlbum(albumName);

        if (!track.artist && !track.title && !track.album) {
          setCoverUrl(DEFAULT_COVER_URL);
          return;
        }

        // Se já fornece imagem de capa direta (ex: AzuraCast song.art)
        if (track.art) {
          setCoverUrl(track.art);
          return;
        }

        setCoverUrl(DEFAULT_COVER_URL);

        // Verifica cache antes de buscar na API externa
        const cacheKey = `${artName || ''}|||${trackTitle}|||${albumName || ''}`.toLowerCase();
        if (coverCache.has(cacheKey)) {
          setCoverUrl(coverCache.get(cacheKey));
          return;
        }

        // Busca na API externa com suporte a álbum e games
        if (artName || trackTitle || albumName) {
          if (coverAbortController) coverAbortController.abort();
          coverAbortController = new AbortController();

          getCoverArt(artName, trackTitle, albumName, coverAbortController.signal)
            .then((url) => {
              if (isMounted) {
                if (url) coverCache.set(cacheKey, url);
                setCoverUrl(url || DEFAULT_COVER_URL);
              }
            })
            .catch((err) => {
              if (err.name !== 'AbortError' && isMounted) {
                setCoverUrl(DEFAULT_COVER_URL);
              }
            });
        } else {
          setCoverUrl(null);
        }
      } catch (err) {
        console.warn('Erro ao atualizar dados do player:', err);
      }
    }

    updateNowPlaying();
    const interval = setInterval(updateNowPlaying, 12000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      if (coverAbortController) coverAbortController.abort();
    };
  }, []);

  const handleCoverError = () => {
    if (coverUrl === DEFAULT_COVER_URL) return;
    if (artist || title) {
      const cacheKey = `${artist || ''}|||${title}|||${album || ''}`.toLowerCase();
      // Se já está no cache mas deu erro, remove para re-buscar
      coverCache.delete(cacheKey);

      getCoverArt(artist, title, album)
        .then((url) => {
          if (url) {
            coverCache.set(cacheKey, url);
            setCoverUrl(url);
          } else {
            setCoverUrl(DEFAULT_COVER_URL);
          }
        })
        .catch(() => setCoverUrl(DEFAULT_COVER_URL));
    }
  };

  return (
    <div className={`${styles.player} mobile-player`}>
      <CoverArt 
        isPlaying={isPlaying} 
        onToggle={togglePlay} 
        coverUrl={coverUrl} 
        onCoverError={handleCoverError}
      />

      <div className={styles.info}>
        {error && <p role="alert">{error}</p>}
        <div className={`${styles.badgeRow} mobile-badge`}>
          <span className={`${styles.badge} ${isPlaying ? styles.badgeLive : ''}`}>
            {isPlaying ? '● AO VIVO' : '24H NO AR'}
          </span>
        </div>

        <h1 className={styles.srOnly}>Underplay Radio</h1>

        <PlayerControls
          isPlaying={isPlaying}
          isFavorited={isFavorited}
          volume={volume}
          onTogglePlay={togglePlay}
          onToggleFavorite={toggleFavorite}
          onVolumeChange={handleVolumeChange}
        />

        <div className={`${styles.nowPlaying} mobile-now-playing`}>
          {artist && <span className={styles.artist}>{artist}</span>}
          <p className={styles.title}>{title}</p>
        </div>

        <Waveform isPlaying={isPlaying} audioRef={audioRef} />
      </div>
    </div>
  );
}

