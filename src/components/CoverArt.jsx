import { useRef, useState, useEffect } from 'react';
import styles from './CoverArt.module.css';

export default function CoverArt({ isPlaying, onToggle, coverUrl, onCoverError }) {
  const cardRef = useRef(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [coverUrl]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((centerY - y) / centerY) * 20;
    const rotateY = ((x - centerX) / centerX) * -20; 
    
    // Coordenadas do brilho (em porcentagem)
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    
    cardRef.current.style.setProperty('--rx', `${rotateX}deg`);
    cardRef.current.style.setProperty('--ry', `${rotateY}deg`);
    cardRef.current.style.setProperty('--gx', `${glareX}%`);
    cardRef.current.style.setProperty('--gy', `${glareY}%`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--rx', '0deg');
    cardRef.current.style.setProperty('--ry', '0deg');
    cardRef.current.style.setProperty('--gx', '50%');
    cardRef.current.style.setProperty('--gy', '50%');
  };

  return (
    <div 
      ref={cardRef}
      className={`${styles.cover} ${isPlaying ? styles.playing : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {coverUrl && !hasError ? (
        <img
          src={coverUrl}
          alt="Album Art"
          className={styles.albumImg}
          onError={() => {
            setHasError(true);
            if (onCoverError) onCoverError();
          }}
        />
      ) : (
        <div className={styles.coverText}>
          Under
          <span>play</span>
        </div>
      )}
    </div>
  );
}
