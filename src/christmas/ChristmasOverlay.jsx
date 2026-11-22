import { useEffect } from 'react';
import './christmas.css';
import { isChristmasSeason } from './season';
import SantaSleigh from './SantaSleigh';
import styles from './ChristmasOverlay.module.css';

// Snow in three depths: far (tiny, sharp, slow), mid, and near (big, out of focus, like light on a lens).
const FLAKES = Array.from({ length: 70 }, (_, i) => {
  const depth = i % 7 === 0 ? 'near' : i % 3 === 0 ? 'mid' : 'far';
  const size = depth === 'near' ? 9 + (i % 4) * 3 : depth === 'mid' ? 3 + (i % 3) : 1.5 + (i % 2);
  return {
    id: i,
    depth,
    left: `${(i * 37.7) % 100}%`,
    delay: `${-((i * 1.37) % 24)}s`,
    duration: `${(depth === 'near' ? 16 : depth === 'mid' ? 13 : 20) + (i % 5) * 1.9}s`,
    size: `${size}px`,
    drift: `${((i % 5) - 2) * 14}px`,
  };
});

// The string of lights along the top: one bulb at the bottom of each swag.
const BULBS = ['#ffd27a', '#ff5a6e', '#7ef0c0', '#ffd27a', '#9ad8ff', '#ff5a6e', '#ffd27a', '#7ef0c0'];
const SWAGS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  color: BULBS[i % BULBS.length],
  delay: `${-(i * 0.37) % 3}s`,
}));

// Glass baubles hanging from the top corners.
const BAUBLES = [
  { id: 'l1', side: 'left', x: '1.4%', len: 170, size: 30, hue: 'gold', delay: '0s' },
  { id: 'l2', side: 'left', x: '3.8%', len: 236, size: 18, hue: 'red', delay: '-1.4s' },
  { id: 'r1', side: 'right', x: '1.4%', len: 210, size: 26, hue: 'red', delay: '-0.8s' },
  { id: 'r2', side: 'right', x: '3.8%', len: 150, size: 20, hue: 'green', delay: '-2s' },
];

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
      <div className={styles.mist} aria-hidden="true" />

      <div className={styles.snow} aria-hidden="true">
        {FLAKES.map((flake) => (
          <span
            key={flake.id}
            className={`${styles.flake} ${styles[flake.depth]}`}
            style={{
              left: flake.left,
              animationDelay: flake.delay,
              animationDuration: flake.duration,
              width: flake.size,
              height: flake.size,
              '--drift': flake.drift,
            }}
          />
        ))}
      </div>

      <SantaSleigh />

      <div className={styles.lights} aria-hidden="true">
        {SWAGS.map((swag) => (
          <span key={swag.id} className={styles.swag}>
            <i className={styles.bulb} style={{ '--bulb': swag.color, animationDelay: swag.delay }} />
          </span>
        ))}
      </div>

      <div className={styles.baubles} aria-hidden="true">
        {BAUBLES.map((b) => (
          <span
            key={b.id}
            className={`${styles.bauble} ${styles[b.hue]}`}
            style={{
              [b.side]: b.x,
              '--len': `${b.len}px`,
              '--size': `${b.size}px`,
              animationDelay: b.delay,
            }}
          >
            <i />
          </span>
        ))}
      </div>

      <div className={styles.seal} aria-hidden="true">
        <span className={styles.ornament}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
            <defs>
              <radialGradient id="xmasOrnament" cx="35%" cy="35%" r="70%">
                <stop offset="0" stopColor="#fff3c4" />
                <stop offset="0.45" stopColor="#e8c35a" />
                <stop offset="1" stopColor="#8a6418" />
              </radialGradient>
            </defs>
            <rect x="10" y="2.5" width="4" height="3" rx="0.8" fill="#cfd3da" />
            <circle cx="12" cy="14" r="8" fill="url(#xmasOrnament)" />
            <path d="M5.2 12.5c2.3 1.3 11.3 1.3 13.6 0" stroke="#fff6d6" strokeOpacity="0.55" strokeWidth="1" />
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
