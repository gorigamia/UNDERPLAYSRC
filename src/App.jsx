import { useEffect, useLayoutEffect, useState, useCallback } from 'react';
import Header from './components/Header';
import SubNav from './components/SubNav';
import Footer from './components/Footer';
import Schedule from './components/Schedule';
import Contato from './components/Contato';
import Landing from './components/Landing';
import RadioPage from './components/RadioPage';
import SongRequests from './components/SongRequests';
import WeatherBackground from './components/WeatherBackground';
import Maintenance from './components/Maintenance';
import styles from './App.module.css';
import { Routes, Route, useLocation } from 'react-router-dom';

import { PlayerProvider } from './context/PlayerContext';

// ==========================================
// MODO MANUTENÇÃO (Troque para true para ativar)
// ==========================================
const IS_MAINTENANCE_MODE = false;

function PageTransition() {
  const location = useLocation();

  useLayoutEffect(() => {
    document.body.classList.add('page-transitioning');
    const t = setTimeout(() => document.body.classList.remove('page-transitioning'), 500);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return null;
}

export default function App() {
  const [manualTheme, setManualTheme] = useState('blue');
  const [currentThemeStr, setCurrentThemeStr] = useState('blue');

  useEffect(() => {
    if (IS_MAINTENANCE_MODE) return;

    const updateTheme = () => {
      const hour = new Date().getHours();
      
      let themeToApply = manualTheme;
      if (!themeToApply) {
        if (hour >= 6 && hour < 12) themeToApply = 'morning';
        else if (hour >= 12 && hour < 18) themeToApply = 'afternoon';
        else themeToApply = 'night';
      }
      
      setCurrentThemeStr(themeToApply);

      if (themeToApply === 'morning') {
        document.body.className = document.body.className.replace(/theme-\w+/g, '').trim() + ' theme-morning';
      } else if (themeToApply === 'afternoon') {
        document.body.className = document.body.className.replace(/theme-\w+/g, '').trim() + ' theme-afternoon';
      } else if (themeToApply === 'blue') {
        document.body.className = document.body.className.replace(/theme-\w+/g, '').trim() + ' theme-blue';
      } else if (themeToApply === 'green') {
        document.body.className = document.body.className.replace(/theme-\w+/g, '').trim() + ' theme-green';
      } else if (themeToApply === 'red') {
        document.body.className = document.body.className.replace(/theme-\w+/g, '').trim() + ' theme-red';
      } else if (themeToApply === 'pink') {
        document.body.className = document.body.className.replace(/theme-\w+/g, '').trim() + ' theme-pink';
      } else if (themeToApply === 'orange') {
        document.body.className = document.body.className.replace(/theme-\w+/g, '').trim() + ' theme-orange';
      } else {
        document.body.className = document.body.className.replace(/theme-\w+/g, '').trim() + ' theme-night';
      }
    };

    updateTheme();
    const interval = setInterval(updateTheme, 1000 * 60);
    return () => clearInterval(interval);
  }, [manualTheme]);

  if (IS_MAINTENANCE_MODE) {
    return <Maintenance />;
  }

  return (
    <PlayerProvider>
      <div className={styles.layout}>
        <PageTransition />
        <WeatherBackground forceTime={currentThemeStr} />
        <Header manualTheme={manualTheme} setManualTheme={setManualTheme} />
        <SubNav />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/radio" element={<RadioPage />} />
          <Route path="/pedidos" element={<><Schedule /><main className={styles.main}><div style={{ width: '100%', maxWidth: '640px', margin: '0 auto' }}><SongRequests /></div></main></>} />
          <Route path="/contato" element={<><Schedule /><main className={styles.contact}><Contato /></main></>} />
        </Routes>
        <Footer />
      </div>
    </PlayerProvider>
  );
}
