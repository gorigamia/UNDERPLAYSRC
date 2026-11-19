import { useState, useEffect, useMemo } from 'react';
import styles from './SongRequests.module.css';

// Sempre usar URLs relativas — passam pelo proxy (Vercel rewrites / Vite proxy)
const API_REQUESTS_URL = '/api/station/underplayradio/requests';
const API_NOWPLAYING_URL = '/api/nowplaying/underplayradio';

// Converte URLs absolutas do AzuraCast para relativas (evita Mixed Content)
function toRelativeArt(url) {
  if (!url) return url;
  try {
    const parsed = new URL(url);
    return parsed.pathname + parsed.search;
  } catch {
    return url;
  }
}

export default function SongRequests({ onClose }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [requestingId, setRequestingId] = useState(null);
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', message: string }
  const [isLiveDJ, setIsLiveDJ] = useState(false);
  const [streamerName, setStreamerName] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function checkLiveAndRequests() {
      if (document.hidden) return;
      try {
        setLoading(true);

        // Checa status de transmissão ao vivo (RadioBOSS / streamer DJ)
        try {
          const npRes = await fetch(API_NOWPLAYING_URL);
          if (npRes.ok) {
            const npData = await npRes.json();
            if (isMounted && npData.live) {
              setIsLiveDJ(!!npData.live.is_live);
              setStreamerName(npData.live.streamer_name || '');
            }
          }
        } catch (e) {}

        // Busca lista de músicas
        const res = await fetch(API_REQUESTS_URL);
        if (!res.ok) throw new Error('Não foi possível carregar a lista de pedidos.');
        const data = await res.json();
        if (isMounted) {
          setSongs(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Erro ao carregar músicas.');
          setLoading(false);
        }
      }
    }

    checkLiveAndRequests();
    const interval = setInterval(checkLiveAndRequests, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const filteredSongs = useMemo(() => {
    if (!searchQuery.trim()) return songs.slice(0, 50);
    const q = searchQuery.toLowerCase().trim();
    return songs.filter((item) => {
      const title = item.song?.title?.toLowerCase() || '';
      const artist = item.song?.artist?.toLowerCase() || '';
      const album = item.song?.album?.toLowerCase() || '';
      const text = item.song?.text?.toLowerCase() || '';
      return title.includes(q) || artist.includes(q) || album.includes(q) || text.includes(q);
    }).slice(0, 80);
  }, [songs, searchQuery]);

  const handleRequestSong = async (item) => {
    if (!item.request_id && !item.request_url) return;
    setRequestingId(item.request_id);
    setFeedback(null);

    // Sempre via URL relativa (proxy Vercel / Vite) para evitar CORS e Mixed Content
    const requestUrl = item.request_url && item.request_url.startsWith('/api')
      ? item.request_url
      : `/api/station/underplayradio/request/${item.request_id}`;

    let res;
    let data;
    try {
      res = await fetch(requestUrl, { method: 'POST' });
      data = await res.json();

      if (res && res.ok && data && data.success) {
        setFeedback({
          type: 'success',
          message: data.formatted_message || data.message || 'Pedido enviado com sucesso! Sua música tocará em breve.',
        });
      } else {
        setFeedback({
          type: 'error',
          message: (data && (data.formatted_message || data.message)) || 'Não foi possível fazer este pedido no momento.',
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'Erro ao conectar ao servidor para fazer o pedido.',
      });
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <div className={styles.badge}>
            <span className={styles.badgeDot}></span>
            PEDIDOS AO VIVO
          </div>
          {onClose && (
            <button onClick={onClose} className={styles.closeBtn} title="Fechar">
              ✕
            </button>
          )}
        </div>
        <h2 className={styles.title}>Peça sua Música na Underplay</h2>
        <p className={styles.subtitle}>
          Pesquise no nosso acervo de <strong>{songs.length > 0 ? songs.length : '1800+'}</strong> faixas e peça para tocar na rádio!
        </p>

        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Pesquisar música, artista ou álbum..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button className={styles.clearBtn} onClick={() => setSearchQuery('')}>
              ✕
            </button>
          )}
        </div>
      </div>

      {isLiveDJ && (
        <div className={styles.liveBanner}>
          <span className={styles.liveBannerIcon}>🎙️</span>
          <div className={styles.liveBannerText}>
            <strong>PROGRAMAÇÃO AO VIVO NO AR {streamerName ? `(${streamerName.toUpperCase()})` : ''}</strong>
            <p>Transmissão ao vivo via RadioBOSS em andamento. Pedidos automáticos temporariamente desativados durante a locução!</p>
          </div>
        </div>
      )}

      {feedback && (
        <div className={`${styles.feedback} ${feedback.type === 'success' ? styles.success : styles.error}`}>
          <span className={styles.feedbackIcon}>{feedback.type === 'success' ? '✓' : '⚠️'}</span>
          <p className={styles.feedbackText}>{feedback.message}</p>
          <button onClick={() => setFeedback(null)} className={styles.feedbackClose}>✕</button>
        </div>
      )}

      <div className={styles.songList}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Carregando acervo de músicas do AzuraCast...</p>
          </div>
        ) : error ? (
          <div className={styles.errorState}>
            <p>⚠️ {error}</p>
            <button onClick={() => window.location.reload()} className={styles.retryBtn}>Tentar Novamente</button>
          </div>
        ) : filteredSongs.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Nenhuma música encontrada para "{searchQuery}".</p>
            <button onClick={() => setSearchQuery('')} className={styles.retryBtn}>Limpar Pesquisa</button>
          </div>
        ) : (
          filteredSongs.map((item) => {
            const song = item.song || {};
            const isRequesting = requestingId === item.request_id;
            return (
              <div key={item.request_id || song.id} className={styles.songCard}>
                <div className={styles.artWrapper}>
                  {song.art ? (
                    <img src={toRelativeArt(song.art)} alt={song.title} className={styles.artImg}
                      onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/assets/fallback-cover.jpg'; }} />
                  ) : (
                    <div className={styles.artPlaceholder}>🎵</div>
                  )}
                </div>
                <div className={styles.songInfo}>
                  <h4 className={styles.songTitle}>{song.title || song.text || 'Sem título'}</h4>
                  <p className={styles.songArtist}>{song.artist || 'Artista Desconhecido'}</p>
                  {song.album && <span className={styles.songAlbum}>{song.album}</span>}
                </div>
                <button
                  onClick={() => handleRequestSong(item)}
                  disabled={isRequesting || isLiveDJ}
                  title={isLiveDJ ? 'Pedidos desativados durante transmissão ao vivo do RadioBOSS' : ''}
                  className={`${styles.requestBtn} ${isRequesting ? styles.requesting : ''} ${isLiveDJ ? styles.disabledLive : ''}`}
                >
                  {isRequesting ? (
                    <>
                      <span className={styles.miniSpinner}></span>
                      Pedindo...
                    </>
                  ) : isLiveDJ ? (
                    'Ao Vivo no Ar'
                  ) : (
                    'Pedir Música'
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
