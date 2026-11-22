import { useEffect, useRef } from 'react';
import styles from './SantaSleigh.module.css';

// The flight: in from the left, a loop in the middle of the sky, out high on the right.
// Built from the window size, so the loop always sits in the same place on any screen.
function flightPath(w, h) {
  const y0 = h * 0.34;
  const cx = w * 0.58;
  const cy = h * 0.3;
  const r = Math.max(110, Math.min(175, w * 0.115)); // wide enough for a sleigh this long to turn in
  return [
    `M -460 ${y0 + 70}`,
    `C ${w * 0.18} ${y0 + 40}, ${w * 0.38} ${cy + r + 40}, ${cx} ${cy + r}`,
    `A ${r} ${r} 0 0 0 ${cx + r} ${cy}`,
    `A ${r} ${r} 0 0 0 ${cx} ${cy - r}`,
    `A ${r} ${r} 0 0 0 ${cx - r} ${cy}`,
    `A ${r} ${r} 0 0 0 ${cx} ${cy + r}`,
    `C ${cx + w * 0.16} ${cy + r}, ${w * 0.86} ${h * 0.16}, ${w + 460} ${h * 0.08}`,
  ].join(' ');
}

const SPARK_COLORS = ['#fff6d6', '#ffe7a3', '#e8c35a', '#ffffff', '#ffd27a'];

function Reindeer({ x, y, phase }) {
  return (
    <g transform={`translate(${x} ${y})`} style={{ '--phase': phase }}>
      {/* back legs */}
      <g className={`${styles.leg} ${styles.legBackA}`} style={{ transformOrigin: '20px 36px' }}>
        <path d="M20 36 L13 48 L16 57" stroke="#6b3f1c" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className={`${styles.leg} ${styles.legBackB}`} style={{ transformOrigin: '24px 36px' }}>
        <path d="M24 36 L18 48 L21 57" stroke="#7c4a22" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* body */}
      <path d="M8 30 C8 21 17 17 30 18 L52 19 C61 19 66 24 66 30 C66 37 59 40 50 40 L22 40 C13 40 8 36 8 30 Z" fill="url(#ssDeer)" />
      <path d="M14 37 C24 41 44 41 58 37" stroke="#f3dcb8" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
      {/* tail */}
      <path d="M9 26 L2 22 L6 31 Z" fill="#f3dcb8" />
      {/* front legs */}
      <g className={`${styles.leg} ${styles.legFrontA}`} style={{ transformOrigin: '54px 37px' }}>
        <path d="M54 37 L61 48 L58 57" stroke="#6b3f1c" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className={`${styles.leg} ${styles.legFrontB}`} style={{ transformOrigin: '58px 37px' }}>
        <path d="M58 37 L65 48 L62 57" stroke="#7c4a22" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* neck and head */}
      <path d="M55 25 C59 16 64 10 70 8 C75 6 80 9 81 13 C82 16 79 18 75 18 L71 18 C68 21 66 26 63 29 Z" fill="url(#ssDeer)" />
      <path d="M70 9 L65 4 L68 10 Z" fill="#7c4a22" />
      <circle cx="74" cy="12" r="1.3" fill="#1d130c" />
      {/* antlers */}
      <path d="M69 8 C67 2 64 -2 59 -4 M64 1 L58 1 M72 7 C73 1 77 -3 82 -4 M76 1 L82 1" stroke="#f0dcae" strokeWidth="2" strokeLinecap="round" />
      {/* collar with a bell */}
      <path d="M59 24 C62 27 66 27 68 24" stroke="#c8202f" strokeWidth="3" strokeLinecap="round" />
      <circle className={styles.bell} cx="64" cy="28" r="2.2" fill="url(#ssGold)" />
                  </g>
  );
}

export default function SantaSleigh() {
  const stageRef = useRef(null);
  const flyerRef = useRef(null);
  const tailRef = useRef(null);
  const trailRef = useRef(null);

  // the path follows the window size
  useEffect(() => {
    const set = () => {
      if (stageRef.current) {
        stageRef.current.style.setProperty('--flight', `path("${flightPath(window.innerWidth, window.innerHeight)}")`);
      }
    };
    set();
    window.addEventListener('resize', set);
    return () => window.removeEventListener('resize', set);
  }, []);

  // the magic dust: sparks left in the sky behind the sleigh, where it was, while it flies
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let n = 0;
    const timer = window.setInterval(() => {
      const flyer = flyerRef.current;
      const tail = tailRef.current;
      const trail = trailRef.current;
      if (!flyer || !tail || !trail || document.hidden) return;
      if (parseFloat(getComputedStyle(flyer).opacity) < 0.5) return;
      if (trail.childElementCount > 90) return;
      const r = tail.getBoundingClientRect();
      for (let k = 0; k < 2; k++) {
        n += 1;
        const s = document.createElement('i');
        const size = 2 + ((n * 7) % 5);
        s.className = styles.spark;
        s.style.left = `${r.left + (Math.random() - 0.5) * 16}px`;
        s.style.top = `${r.top + (Math.random() - 0.5) * 16}px`;
        s.style.width = `${size}px`;
        s.style.height = `${size}px`;
        s.style.setProperty('--c', SPARK_COLORS[n % SPARK_COLORS.length]);
        s.style.setProperty('--dx', `${(Math.random() - 0.5) * 40}px`);
        s.style.setProperty('--dy', `${20 + Math.random() * 50}px`);
        s.style.animationDuration = `${0.9 + Math.random() * 1.1}s`;
        if (n % 6 === 0) s.classList.add(styles.star);
        s.addEventListener('animationend', () => s.remove(), { once: true });
        trail.appendChild(s);
      }
    }, 40);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div ref={stageRef} className={styles.stage} aria-hidden="true">
      <div ref={trailRef} className={styles.trail} />
      <div ref={flyerRef} className={styles.flyer}>
        <div className={styles.bob}>
          <svg className={styles.art} viewBox="-10 -6 350 132" width="350" height="132" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="ssDeer" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#d9a56a" />
                <stop offset="1" stopColor="#7c4a22" />
              </linearGradient>
              <linearGradient id="ssRed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ef3b4f" />
                <stop offset="1" stopColor="#8e1023" />
              </linearGradient>
              <linearGradient id="ssGold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fff1c2" />
                <stop offset="0.55" stopColor="#e8c35a" />
                <stop offset="1" stopColor="#a87a22" />
              </linearGradient>
              <linearGradient id="ssSack" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#b98450" />
                <stop offset="1" stopColor="#6b4220" />
              </linearGradient>
              <radialGradient id="ssHalo" cx="50%" cy="55%" r="50%">
                <stop offset="0" stopColor="#ffe7a3" stopOpacity="0.2" />
                <stop offset="1" stopColor="#ffe7a3" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="ssNose" cx="40%" cy="40%" r="60%">
                <stop offset="0" stopColor="#ffd0d6" />
                <stop offset="0.5" stopColor="#ff3b55" />
                <stop offset="1" stopColor="#a3001b" />
              </radialGradient>
            </defs>

            {/* warm halo around everything */}
            <ellipse cx="170" cy="62" rx="200" ry="80" fill="url(#ssHalo)" />

            {/* ---------- the reindeer, galloping a little out of step ---------- */}
            <Reindeer x={160} y={44} phase="-0.18s" />
            <Reindeer x={244} y={36} phase="0s" />
            {/* Rudolph's nose on the lead reindeer */}
            <circle className={styles.nose} cx={244 + 81.5} cy={36 + 14} r="3.6" fill="url(#ssNose)" />

            {/* reins, from Santa's hand to both collars */}
            <path d="M92 64 C130 56 176 66 224 68 M224 68 C256 66 282 62 308 60" stroke="url(#ssGold)" strokeWidth="1.3" strokeLinecap="round" opacity="0.9" />

            {/* ---------- the sleigh ---------- */}
            <g transform="translate(8 46)">
              {/* the sack with presents */}
              <path d="M62 20 C58 4 67 -9 78 -9 C89 -9 96 4 92 20 Z" fill="url(#ssSack)" />
              <path d="M70 -8 C75 -4 82 -4 87 -8" stroke="#3b2412" strokeWidth="1.6" strokeLinecap="round" />
              <g transform="rotate(-12 74 -12)">
                <rect x="68" y="-20" width="12" height="11" rx="1.5" fill="#1f9e6e" />
                <path d="M74 -20 V-9 M68 -14.5 H80" stroke="#ffe7a3" strokeWidth="1.6" />
              </g>
              <g transform="rotate(10 86 -10)">
                <rect x="81" y="-16" width="10" height="9" rx="1.5" fill="#3b82f6" />
                <path d="M86 -16 V-7 M81 -11.5 H91" stroke="#ffe7a3" strokeWidth="1.4" />
              </g>

              {/* Santa */}
              <g className={styles.santa}>
                <path d="M26 20 C26 2 36 -5 44 -5 C52 -5 60 2 60 20 Z" fill="url(#ssRed)" />
                <rect x="41.5" y="-3" width="5" height="23" rx="2" fill="#fdfbf5" />
                <rect x="26" y="9" width="34" height="4.5" fill="#1f1a17" />
                <rect x="40.5" y="8.2" width="7" height="6" rx="1" fill="none" stroke="url(#ssGold)" strokeWidth="1.5" />
                {/* the hand on the reins */}
                <path d="M57 6 C67 8 76 12 84 18" stroke="url(#ssRed)" strokeWidth="5.5" strokeLinecap="round" />
                <circle cx="85" cy="18" r="3.4" fill="#fdfbf5" />
                {/* face, beard, hat */}
                <circle cx="44" cy="-13" r="9" fill="#f5cfa6" />
                <path d="M35 -13 C35 1 53 1 53 -13 C49 -8 39 -8 35 -13 Z" fill="#fdfbf5" />
                <path d="M39 -9 C42 -7 46 -7 49 -9" stroke="#e9e2d3" strokeWidth="2" strokeLinecap="round" />
                <circle cx="41" cy="-15" r="1.1" fill="#2b2118" />
                <circle cx="47" cy="-15" r="1.1" fill="#2b2118" />
                <circle cx="44" cy="-12" r="1.6" fill="#e8a37f" />
                <g className={styles.hat} style={{ transformOrigin: '44px -19px' }}>
                  <path d="M35 -18 C36 -30 48 -34 58 -28 L64 -33 L60 -22 Z" fill="url(#ssRed)" />
                  <circle className={styles.pompom} cx="64.5" cy="-33.5" r="3.6" fill="#fdfbf5" />
                </g>
                <rect x="34" y="-21" width="20" height="5" rx="2.5" fill="#fdfbf5" />
                {/* the waving arm */}
                <g className={styles.wave} style={{ transformOrigin: '30px 4px' }}>
                  <path d="M30 4 C22 0 18 -8 16 -16" stroke="url(#ssRed)" strokeWidth="5.5" strokeLinecap="round" />
                  <circle cx="15.5" cy="-18" r="3.6" fill="#fdfbf5" />
                </g>
              </g>

              {/* the sleigh body, with gold trim */}
              <path d="M4 22 C4 17 8 16 14 16 L76 16 C86 16 92 8 100 4 C107 1 113 5 110 12 C108 18 101 19 99 26 L97 40 C96 46 91 50 82 50 L24 50 C12 50 4 42 4 32 Z" fill="url(#ssRed)" />
              <path d="M10 22 L74 22 C84 22 92 16 100 10" stroke="url(#ssGold)" strokeWidth="2" strokeLinecap="round" />
              <path d="M18 34 C30 30 40 40 52 34 C62 30 72 40 84 34" stroke="url(#ssGold)" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
              {/* struts and runner with its curl */}
              <path d="M24 50 L22 60 M76 50 L78 60" stroke="url(#ssGold)" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M-2 60 L92 60 C104 60 112 54 114 44 C115 39 111 37 108 40" stroke="url(#ssGold)" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M-2 60 C-8 60 -10 53 -4 51" stroke="url(#ssGold)" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* where the dust comes from */}
              <circle ref={tailRef} cx="-4" cy="58" r="0.5" fill="none" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
