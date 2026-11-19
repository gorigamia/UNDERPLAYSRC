import { useEffect, useRef, useState } from 'react';
import styles from './IntroScreen.module.css';
import logo from '../logo/logo.png';

const LOCK_AT = 1500;      // ms — quando o sinal "trava"
const DURATION = 2300;     // ms — duração total antes do fade
const FADE_OUT = 550;      // ms — transição de saída
const JITTER_MS = 70;      // ms — intervalo do "ruído" da varredura

const FINAL_FREQ = '104,1 FM';
const BAR_HEIGHTS = [30, 50, 37, 56, 43, 48]; // silhueta final (px), ecoa o mark da marca

function randomFreq() {
  const n = 87.5 + Math.random() * (107.9 - 87.5);
  return `${n.toFixed(1).replace('.', ',')} FM`;
}

function randomJitter() {
  return BAR_HEIGHTS.map(() => 6 + Math.random() * 40);
}

export default function IntroScreen({ onFinish }) {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const [locked, setLocked] = useState(prefersReducedMotion);
  const [leaving, setLeaving] = useState(false);
  const [freq, setFreq] = useState(prefersReducedMotion ? FINAL_FREQ : randomFreq());
  const [bars, setBars] = useState(prefersReducedMotion ? BAR_HEIGHTS : randomJitter());
  const jitterRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    jitterRef.current = setInterval(() => {
      setBars(randomJitter());
      setFreq(randomFreq());
    }, JITTER_MS);

    return () => clearInterval(jitterRef.current);
  }, [prefersReducedMotion]);

  useEffect(() => {
    const total = prefersReducedMotion ? 1100 : DURATION;
    const lockAt = prefersReducedMotion ? 0 : LOCK_AT;
    const start = performance.now();
    let raf;

    function tick(now) {
      const elapsed = now - start;

      if (!prefersReducedMotion && elapsed >= lockAt) {
        clearInterval(jitterRef.current);
        setLocked(true);
        setFreq(FINAL_FREQ);
        setBars(BAR_HEIGHTS);
      }

      if (elapsed < total) {
        raf = requestAnimationFrame(tick);
      } else {
        setLeaving(true);
        setTimeout(onFinish, FADE_OUT);
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onFinish, prefersReducedMotion]);

  return (
    <div className={`${styles.intro} ${leaving ? styles.leaving : ''}`}>
      <div className={styles.vignette} />

      <div className={styles.stage}>
        <span className={`${styles.freq} ${locked ? styles.freqLocked : ''}`}>
          {freq}
        </span>

        <div className={styles.eq} aria-hidden="true">
          {bars.map((h, i) => (
            <div
              key={i}
              className={`${styles.bar} ${locked ? styles.barLocked : ''}`}
              style={{
                height: `${h}px`,
                transitionDelay: locked ? `${i * 55}ms` : '0ms',
              }}
            />
          ))}
        </div>
        <div className={styles.baseline} />

        <img
          className={`${styles.wordmark} ${locked ? styles.wordmarkShow : ''}`}
          src={logo}
          alt="Underplay Radio"
        />

        <div className={styles.taglineWrap}>
          <span className={`${styles.tagline} ${!locked ? styles.visible : ''}`}>
            sintonizando
          </span>
          <span className={`${styles.tagline} ${locked ? styles.visible : ''}`}>
            no ar
          </span>
        </div>

        <div className={`${styles.originTag} ${locked ? styles.originTagShow : ''}`}>
          Criada em 2018 por <strong>gorigamia</strong> · Comunidade, PC Games & Boa Música
        </div>
      </div>
    </div>
  );
}
