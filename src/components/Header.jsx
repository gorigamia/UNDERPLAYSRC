import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';
import logo from '../logo/logo.png';
import { usePlayer } from '../hooks/usePlayer';
import { isChristmasSeason } from '../christmas/season';

export default function Header({ manualTheme, setManualTheme }) {
  const { audioRef } = usePlayer();
  const [weather, setWeather] = useState(null);
  const [showFull, setShowFull] = useState(true);
  const [now, setNow] = useState(() => new Date());

  const getSeason = (month) => {
    if (month === 11 || month <= 1) return { name: 'Verão', icon: '☀️' };
    if (month >= 2 && month <= 4) return { name: 'Outono', icon: '🍂' };
    if (month >= 5 && month <= 7) return { name: 'Inverno', icon: '❄️' };
    return { name: 'Primavera', icon: '🌸' };
  };

  useEffect(() => {
    async function fetchSP() {
      try {
        const lat = -23.5505;
        const lon = -46.6333;
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await res.json();
        const code = data.current_weather.weathercode;
        const temp = Math.round(data.current_weather.temperature);
        
        const isDay = data.current_weather.is_day === 1;
        
        let icon = '☁️';
        if (code === 0) icon = isDay ? '☀️' : '🌙';
        else if (code === 1 || code === 2) icon = isDay ? '⛅' : '☁️'; 
        else if (code === 3) icon = '☁️'; // Nublado completo (sem sol/lua)
        else if (code >= 51 && code <= 67) icon = '🌧️'; // Chuva
        else if (code >= 80 && code <= 82) icon = '🌧️'; // Pancadas de chuva
        else if (code >= 71 && code <= 77) icon = '❄️'; // Neve
        else if (code >= 95) icon = '⛈️'; // Tempestade
        else icon = '🌫️'; // Névoa/Neblina
        
        setWeather({ temp, icon });
      } catch (err) {
        console.log("Weather error:", err);
      }
    }
    fetchSP();
  }, []);

  // Motion cíclico: Alterna entre versão longa e curta
  useEffect(() => {
    const interval = setInterval(() => {
      setShowFull(prev => !prev);
    }, 5000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const cycleTheme = () => {
    if (!manualTheme) setManualTheme('blue');
    else if (manualTheme === 'blue') setManualTheme('green');
    else if (manualTheme === 'green') setManualTheme('red');
    else if (manualTheme === 'red') setManualTheme('pink');
    else if (manualTheme === 'pink') setManualTheme('orange');
    else setManualTheme(null);
  };

  const getThemeLabel = () => {
    if (!manualTheme) return 'Auto';
    if (manualTheme === 'blue') return 'Azul';
    if (manualTheme === 'green') return 'Verde';
    if (manualTheme === 'red') return 'Vermelho';
    if (manualTheme === 'pink') return 'Rosa';
    if (manualTheme === 'orange') return 'Laranja';
    return 'Azul';
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftGroup}>
        <div className={styles.weatherBox}>
          <div className={styles.infoRow}>
            {weather && (
              <div key={showFull ? 'full' : 'short'} className={styles.weatherAnim}>
                {showFull
                  ? `SÃO PAULO ${weather.temp}ºC ${weather.icon}`
                  : `SP ${weather.temp}ºC ${weather.icon}`}
              </div>
            )}
            <span className={styles.season} title={`Estação: ${getSeason(now.getMonth()).name}`}>
              {getSeason(now.getMonth()).icon} {getSeason(now.getMonth()).name}
            </span>
            <time className={styles.clock} dateTime={now.toISOString()}>
              {now.toLocaleDateString('pt-BR')} {now.toLocaleTimeString('pt-BR')}
            </time>
          </div>
        </div>
        <div className={styles.logoWrapper}>
          <div className={styles.logoContainer}>
            <img className={styles.logoImg} src={logo} alt="Underplay" />
            <div className={styles.shine} />
          </div>
        </div>
      </div>
      <nav className={styles.navRight}>
        {!isChristmasSeason() && (
          <button 
            onClick={cycleTheme} 
            className={styles.themeToggle}
            title="Alternar Tema do Dia"
          >
            {getThemeLabel()}
          </button>
        )}
        <NavLink
          to="/"
          end
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          onClick={() => {
            audioRef?.current?.pause();
          }}
        >
          Home
        </NavLink>
        <NavLink
          to="/radio"
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
        >
          Rádio
        </NavLink>
        <NavLink
          to="/contato"
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          onClick={() => {
            audioRef?.current?.pause();
          }}
        >
          Contato
        </NavLink>
        <a 
          href="https://www.reddit.com/r/PCismoOnline/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.socialLink}
          aria-label="Reddit PCismoOnline"
          title="Reddit r/PCismoOnline"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.505 1.12-.816 2.703-1.353 4.437-1.46l.872-4.084a.434.434 0 0 1 .5-.33l2.853.595a1.257 1.257 0 0 1 1.36-.728zm-4.72 10.334c1.393 0 2.693-.243 3.645-.688l-.344-1.026c-.732.327-1.83.545-3.301.545-1.472 0-2.57-.218-3.302-.545l-.344 1.026c.952.445 2.252.688 3.645.688zm3.012-3.815c-.689 0-1.25-.561-1.25-1.25s.561-1.249 1.25-1.249 1.25.56 1.25 1.249-.561 1.25-1.25 1.25zm-6.025 0c-.689 0-1.25-.561-1.25-1.25s.561-1.249 1.25-1.249 1.25.56 1.25 1.249-.561 1.25-1.25 1.25z"/>
          </svg>
        </a>
        <a 
          href="https://archive.org/details/@adoregabriel_antigo_" 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.socialLink}
          aria-label="Perfil no Internet Archive"
          title="Internet Archive (@adoregabriel_antigo_)"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 2L2 7v2h20V7L12 2zm-8 8v9h3v-9H4zm5 0v9h3v-9H9zm5 0v9h3v-9h-3zm5 0v9h3v-9h-3zM2 20v2h20v-2H2z"/>
          </svg>
        </a>
        <a
          href="https://www.acervomamonas.com.br/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
          aria-label="Acervo Mamonas Assassinas"
          title="Acervo Mamonas Assassinas"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            {/* Spike sun / virus icon — inspirado na logo das Mamonas Assassinas */}
            <circle cx="12" cy="12" r="4"/>
            <line x1="12" y1="2"  x2="12" y2="5.5"  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="18.5" x2="12" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="2"  y1="12" x2="5.5"  y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="18.5" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="4.93" y1="4.93"  x2="7.34" y2="7.34"  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="16.66" y1="16.66" x2="19.07" y2="19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="19.07" y1="4.93"  x2="16.66" y2="7.34"  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="7.34"  y1="16.66" x2="4.93"  y2="19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="8.5"  y1="2.8"  x2="9.3"  y2="6.2"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="15.5" y1="2.8"  x2="14.7" y2="6.2"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="8.5"  y1="21.2" x2="9.3"  y2="17.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="15.5" y1="21.2" x2="14.7" y2="17.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="2.8"  y1="8.5"  x2="6.2"  y2="9.3"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="2.8"  y1="15.5" x2="6.2"  y2="14.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="21.2" y1="8.5"  x2="17.8" y2="9.3"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="21.2" y1="15.5" x2="17.8" y2="14.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </a>
      </nav>
    </header>
  );
}
