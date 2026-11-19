import { createContext, useCallback, useContext, useRef, useState } from 'react';

const STREAM_URL = '/listen/underplayradio/radio.mp3';
const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isFavorited, setIsFavorited] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);
  const retriesRef = useRef(0);
  const maxRetries = 3;

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute('src');
        audioRef.current.load();
      }
      setIsPlaying(false);
      setError(null);
      retriesRef.current = 0;
      return;
    }

    const url = `${STREAM_URL}?t=${Date.now()}`;
    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = 'none';
      audio.volume = volume / 100;
      audio.crossOrigin = 'anonymous';
      audioRef.current = audio;
    }

    audioRef.current.onerror = () => {
      if (retriesRef.current < maxRetries) {
        retriesRef.current += 1;
        console.warn(`Stream com erro, tentativa ${retriesRef.current}/${maxRetries}...`);
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.src = `${STREAM_URL}?t=${Date.now()}`;
            audioRef.current.play().catch(() => {
              setIsPlaying(false);
              setError('Não foi possível conectar à rádio. Tente novamente.');
            });
          }
        }, 2000 * retriesRef.current);
      } else {
        setIsPlaying(false);
        setError('Não foi possível conectar à rádio. Verifique sua conexão e tente novamente.');
      }
    };

    audioRef.current.src = url;
    audioRef.current.volume = volume / 100;
    setError(null);
    retriesRef.current = 0;
    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
        setError(null);
      })
      .catch((err) => {
        console.warn('Erro ao reproduzir streaming:', err);
        setIsPlaying(false);
        setError('Não foi possível iniciar a reprodução. Toque novamente para tentar.');
      });
  }, [isPlaying, volume]);

  const handleVolumeChange = useCallback((value) => {
    const next = Number(value);
    setVolume(next);
    if (audioRef.current) audioRef.current.volume = next / 100;
  }, []);

  const toggleFavorite = useCallback(() => {
    setIsFavorited((f) => !f);
  }, []);

  return (
    <PlayerContext.Provider value={{
      isPlaying,
      volume,
      isFavorited,
      error,
      togglePlay,
      handleVolumeChange,
      toggleFavorite,
      setIsPlaying,
      audioRef,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within a PlayerProvider');
  return context;
}
