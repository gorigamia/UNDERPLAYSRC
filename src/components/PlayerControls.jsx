import styles from './PlayerControls.module.css';

export default function PlayerControls({ isPlaying, isFavorited, volume, onTogglePlay, onToggleFavorite, onVolumeChange }) {
  async function handleShare() {
    const shareData = {
      title: 'Underplay Radio',
      text: 'Estou ouvindo a Underplay Radio agora!',
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // usuário cancelou o compartilhamento
      }
    } else {
      await navigator.clipboard.writeText(shareData.url);
      alert('Link copiado!');
    }
  }

  return (
    <div className={styles.controls}>
      <button
        className={`${styles.iconBtn} ${isFavorited ? styles.favorited : ''}`}
        onClick={onToggleFavorite}
        aria-label={isFavorited ? 'Desfavoritar' : 'Favoritar'}
        title="Favoritar"
      >
        {isFavorited ? '♥' : '♡'}
      </button>

      <button
        className={styles.playMain}
        onClick={onTogglePlay}
        aria-label={isPlaying ? 'Pausar' : 'Tocar'}
      >
        {isPlaying ? (
          <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
      </button>

      <div className={styles.volumeWrap}>
        <svg className={styles.volIcon} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="4,9 8,9 13,4.5 13,19.5 8,15 4,15" fill="currentColor" stroke="none" />
          <path d="M16.5 8.5c1.4 1.9 1.4 5.1 0 7" />
        </svg>
        <input
          type="range"
          className={styles.volSlider}
          min={0}
          max={100}
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          aria-label="Volume"
          style={{
            background: `linear-gradient(to right, var(--blue-mid) ${volume}%, rgba(24,95,165,0.18) ${volume}%)`,
          }}
        />
        <span className={styles.volValue}>{volume}</span>
      </div>

      <button
        className={styles.iconBtn}
        onClick={handleShare}
        aria-label="Compartilhar"
        title="Compartilhar"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.6" y1="10.6" x2="15.4" y2="6.4" />
          <line x1="8.6" y1="13.4" x2="15.4" y2="17.6" />
        </svg>
      </button>

      <a
        className={styles.iconBtn}
        href="/contato"
        aria-label="Informações"
        title="Informações"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="11" x2="12" y2="16.5" />
          <circle cx="12" cy="7.5" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      </a>
    </div>
  );
}
