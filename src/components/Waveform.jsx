import { useEffect, useRef } from 'react';
import styles from './Waveform.module.css';

const BAR_COUNT = 40;

export default function Waveform({ isPlaying, audioRef }) {
  const barsRef = useRef([]);
  const animationRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceNodeRef = useRef(null);

  useEffect(() => {
    if (!isPlaying) {
      window.bassValue = 0;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    if (!audioCtxRef.current && audioRef?.current) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioContext();
        analyserRef.current = audioCtxRef.current.createAnalyser();
        analyserRef.current.fftSize = 512;
        analyserRef.current.smoothingTimeConstant = 0.85;
        analyserRef.current.minDecibels = -85;
        analyserRef.current.maxDecibels = -25;
        sourceNodeRef.current = audioCtxRef.current.createMediaElementSource(audioRef.current);
        sourceNodeRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioCtxRef.current.destination);
        dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
      } catch (err) {
        console.warn('AudioContext failed to initialize:', err);
      }
    }

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    const renderFrame = () => {
      if (document.hidden) {
        animationRef.current = requestAnimationFrame(renderFrame);
        return;
      }
      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        const step = 30 / BAR_COUNT;
        let bassSum = 0;
        for (let b = 0; b < 4; b++) bassSum += dataArrayRef.current[b] || 0;
        window.bassValue = bassSum / 4;
        for (let i = 0; i < BAR_COUNT; i++) {
          const bar = barsRef.current[i];
          if (bar) {
            const value = dataArrayRef.current[Math.floor(2 + i * step)] || 0;
            const boost = 1 + Math.pow(i / BAR_COUNT, 1.3) * 1.2;
            const scale = Math.max(0.15, Math.min(1, (value / 255) * boost));
            bar.style.transform = `scaleY(${scale})`;
          }
        }
      }
      animationRef.current = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, audioRef]);

  return (
    <div className={`${styles.waveform} ${isPlaying ? styles.playing : styles.idle}`}>
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => (barsRef.current[i] = el)}
          className={styles.bar}
          style={{ animationDelay: isPlaying ? '0s' : `${i * 0.06}s` }}
        />
      ))}
    </div>
  );
}
