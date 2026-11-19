import { useState, useEffect } from 'react';
import styles from './Schedule.module.css';

const DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

const WEEKLY_SCHEDULE = {
  "Terça": [
    {
      "time": "20:00",
      "title": "Show da Noite",
      "dj": "DJ Gorigamia"
    }
  ],
  "Sábado": [
    {
      "time": "20:00",
      "title": "Show da Noite",
      "dj": "DJ Gorigamia"
    }
  ],
  "Domingo": [
    {
      "time": "14:00",
      "title": "Games Music",
      "dj": "DJ Gorigamia"
    }
  ]
};

export default function Schedule() {
  const [schedule] = useState(WEEKLY_SCHEDULE);
  const [day, setDay] = useState(null);
  const [index, setIndex] = useState(0);
  const [pulse, setPulse] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Define o dia de hoje ou o próximo dia com programação
  useEffect(() => {
    if (!schedule || Object.keys(schedule).length === 0) return;
    const todayIndex = new Date().getDay();
    for (let i = 0; i < 7; i++) {
      const d = DAYS[(todayIndex + i) % 7];
      if (schedule[d]) {
        setDay(d);
        return;
      }
    }
  }, [schedule]);

  function getNextDay(currentDay) {
    const i = DAYS.indexOf(currentDay);
    for (let j = 1; j <= 7; j++) {
      const next = DAYS[(i + j) % 7];
      if (schedule[next]) return next;
    }
    return null;
  }

  const programs = day ? schedule[day] : [];

  useEffect(() => {
    if (!programs || programs.length === 0 || !isOpen) return;
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => {
        setIndex((i) => {
          const next = i + 1;
          if (next >= programs.length) {
            const nextDay = getNextDay(day);
            if (nextDay) setDay(nextDay);
            return 0;
          }
          return next;
        });
        setPulse(false);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, [programs, day, isOpen]);

  if (!day || !programs || programs.length === 0) return null;

  const current = programs[index];

  if (!isOpen) {
    return (
      <button 
        className={styles.toggleBtn} 
        onClick={() => setIsOpen(true)}
        aria-label="Abrir programação"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
        <span>Programação</span>
      </button>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.dayLabel}>{day}</span>
        <button 
          className={styles.closeBtn} 
          onClick={() => setIsOpen(false)}
          aria-label="Minimizar programação"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>
      <div className={`${styles.card} ${pulse ? styles.pulse : ''}`}>
        <span className={styles.time}>{current.time}</span>
        <div className={styles.info}>
          <p className={styles.title}>{current.title}</p>
          <p className={styles.dj}>{current.dj}</p>
        </div>
        <div className={styles.dots}>
          {programs.map((_, i) => (
            <span key={i} className={`${styles.dot} ${i === index ? styles.dotActive : ''}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
