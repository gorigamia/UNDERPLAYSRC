import { useEffect } from 'react';
import './christmas.css';
import { isChristmasSeason } from './season';
import SantaSleigh from './SantaSleigh';
import styles from './ChristmasOverlay.module.css';

const FLAKES = Array.from({ length: 64 }, (_, i) => ({
  id: i,
  left: `${(i * 37.7) % 100}%`,
  delay: `${-((i * 1.37) % 20)}s`,
  duration: `${9 + (i % 7) * 1.7}s`,
  size: `${3 + (i % 5) * 1.5}px`,
  opacity: 0.18 + (i % 4) * 0.08,
}));

const STARS = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: `${(i * 47.3 + 6) % 100}%`,
  top: `${4 + (i * 13) % 34}%`,
  size: `${2 + (i % 3)}px`,
  delay: `${-((i * 0.9) % 4)}s`,
}));

export default function ChristmasOverlay() {
  const active = isChristmasSeason();

  useEffect(() => {
    const root = document.documentElement;
    if (active) root.classList.add('xmas-on');
    return () => root.classList.remove('xmas-on');
  }, [active]);

  if (!active) return null;

  return (
    <>
      <div className={styles.forest} aria-hidden="true" />
      <div className={styles.snow} aria-hidden="true">
        {FLAKES.map((flake) => (
          <span
            key={flake.id}
            className={styles.flake}
            style={{
              left: flake.left,
              animationDelay: flake.delay,
              animationDuration: flake.duration,
              width: flake.size,
              height: flake.size,
              opacity: flake.opacity,
            }}
          />
        ))}
      </div>
      <div className={styles.stars} aria-hidden="true">
        {STARS.map((star) => (
          <span
            key={star.id}
            className={styles.star}
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>
      <div className={styles.santa} aria-hidden="true">
        <div className={styles.santaInner}>
          <SantaSleigh />
        </div>
      </div>
      <div className={styles.garland} aria-hidden="true" />
      <div className={styles.seal} aria-hidden="true">
        <span className={styles.bell}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <path d="M10 20a2 2 0 0 0 4 0" />
          </svg>
        </span>
        <span className={styles.sealText}>
          <span className={styles.sealTitle}>Feliz Natal</span>
          <span className={styles.sealSub}>Underplay Radio · 24h</span>
        </span>
      </div>
    </>
  );
}
