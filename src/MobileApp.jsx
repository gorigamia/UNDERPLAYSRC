import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import Player from './components/Player';
import Chat from './components/Chat';
import SongRequests from './components/SongRequests';
import Schedule from './components/Schedule';
import Landing from './components/Landing';
import Contato from './components/Contato';
import WeatherBackground from './components/WeatherBackground';
import Footer from './components/Footer';
import logo from './logo/logo.png';
import './mobile.css';

const THEMES = ['blue', 'green', 'red', 'pink', 'orange', 'auto'];
const LABELS = ['Azul', 'Verde', 'Vermelho', 'Rosa', 'Laranja', 'Automático'];
export function Icon({name}) {
  const paths = { radio: <><path d="M4 8h16v12H4zM5 8l13-5M7 12h10"/><circle cx="8" cy="16" r="1"/><path d="M14 16h3"/></>, chat:<path d="M4 4h16v12H9l-5 4z"/>, music:<><path d="M9 17V5l11-2v12"/><circle cx="6" cy="17" r="3"/><circle cx="17" cy="15" r="3"/></>, more:<><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></> };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="23" height="23" aria-hidden="true">{paths[name]}</svg>;
}
function MobileShell() {
  const location = useLocation();
  const [tab, setTab] = useState(location.pathname === '/pedidos' ? 'music' : location.pathname === '/contato' ? 'more' : 'radio');
  const [morePage, setMorePage] = useState(location.pathname === '/contato' ? 'contact' : 'menu');
  const [theme, setTheme] = useState(() => localStorage.getItem('underplay-theme') || 'blue');
  const [track, setTrack] = useState({title:'Underplay Radio',artist:'PC Games & boa música',cover:'/assets/fallback-cover.jpg'});
  const [weather, setWeather] = useState('');
  const [raining, setRaining] = useState(false);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(timer); }, []);
  const season = ['Verão','Verão','Outono','Outono','Outono','Inverno','Inverno','Inverno','Primavera','Primavera','Primavera','Verão'][now.getMonth()];
  const {isPlaying, togglePlay} = usePlayer();
  useEffect(() => {
    const listener = e => setTrack(e.detail); window.addEventListener('underplay-track', listener);
    return () => window.removeEventListener('underplay-track', listener);
  }, []);
  useEffect(() => {
    if (location.pathname === '/contato') { setTab('more'); setMorePage('contact'); }
    if (location.pathname === '/pedidos') setTab('music');
  }, [location.pathname]);
  useEffect(() => {
    const apply = () => { const hour = new Date().getHours(); const selected = theme === 'auto' ? hour < 6 || hour >= 18 ? 'night' : hour < 12 ? 'morning' : 'afternoon' : theme;
      document.body.className = 'theme-' + selected;
    }; apply(); localStorage.setItem('underplay-theme', theme); const timer = setInterval(apply, 60000); return () => clearInterval(timer);
  }, [theme]);
  useEffect(() => { const controller = new AbortController(); fetch('https://api.open-meteo.com/v1/forecast?latitude=-23.5505&longitude=-46.6333&current_weather=true', {signal:controller.signal}).then(r=>r.json()).then(d=>{setWeather('SP ' + Math.round(d.current_weather.temperature) + '°');setRaining([51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,99].includes(d.current_weather.weathercode));}).catch(()=>{}); return () => controller.abort(); }, []);
  const tabs = [['radio','Ouvir'],['chat','Chat'],['music','Pedidos'],['more','Mais']];
  const hour = now.getHours();
  const backgroundTheme = theme === 'auto' ? hour < 6 || hour >= 18 ? 'night' : hour < 12 ? 'morning' : 'afternoon' : theme;
  return <><WeatherBackground forceTime={backgroundTheme} raining={raining}/><div className="mobile-shell">
    <header className="mobile-header"><img src={logo} alt="Underplay Radio"/><div className="mobile-station"><span>RÁDIO DO PCISMO</span><small>DESDE 2018 {weather && ' · ' + weather}</small></div><button className="theme-chip" onClick={()=>setTheme(THEMES[(THEMES.indexOf(theme)+1)%THEMES.length])} aria-label="Mudar tema">{LABELS[THEMES.indexOf(theme)]}</button></header>
    <main className="mobile-content">
      <div className="listening-screen" style={{display:tab === 'radio' ? 'block':'none'}}>
        <div className="station-caption"><span><i/> UNDERPLAY · AO VIVO</span><span>24 HORAS NO AR</span></div>
        <Player />
        <div className="mobile-programme"><Schedule /></div>
        <div className="station-signature">VOLTAMOS PRA FICAR!<small>Comunidade, PC Games & boa música</small></div>
      </div>
      {tab === 'chat' && <section className="mobile-panel"><h1>Na mesma frequência<span>Converse com a comunidade</span></h1><Chat /></section>}
      {tab === 'music' && <section className="mobile-panel"><h1>A próxima pode ser sua<span>Pesquise e peça uma música</span></h1><SongRequests /></section>}
      {tab === 'more' && <section className="mobile-panel mobile-more"><h1>Universo Underplay<span>A rádio oficial do PCismo</span></h1>
        {morePage !== 'menu' && <button className="back-menu" onClick={()=>setMorePage('menu')}>← Voltar para Mais</button>}
        {morePage === 'menu' ? <>
          <button className="menu-card" onClick={()=>setMorePage('about')}>Sobre a Underplay<span>História, PCismo e recursos da rádio →</span></button>
          <button className="menu-card" onClick={()=>setMorePage('players')}>Players externos & RadiosNet<span>AIMP, Winamp, VLC, Icecast, HLS, M3U e PLS →</span></button>
          <button className="menu-card" onClick={()=>setMorePage('games')}>Rádio dentro do jogo<span>Euro Truck, American Truck e Farming Simulator →</span></button>
          <button className="menu-card" onClick={()=>setMorePage('programme')}>Programação<span>Dias, horários e apresentadores →</span></button>
          <button className="menu-card" onClick={()=>setMorePage('community')}>Comunidade & acervos<span>PCismoOnline, Internet Archive e Mamonas Assassinas →</span></button>
          <button className="menu-card" onClick={()=>setMorePage('contact')}>Contato<span>Formulário e e-mail da Underplay →</span></button>
          <button className="menu-card" onClick={()=>setMorePage('appearance')}>Temas, clima & relógio<span>Cores, modo automático e informações de São Paulo →</span></button>
          <Footer />
        </> : ['about','players','games'].includes(morePage) ? <Landing section={morePage} onListen={()=>setTab('radio')} />
          : morePage === 'contact' ? <Contato />
          : morePage === 'programme' ? <div className="more-detail"><h2>Programação</h2><p>Horários de Brasília</p><article><h3>Show da Noite</h3><p>Terça e sábado · 20h<br/>DJ Gorigamia</p></article><article><h3>Games Music</h3><p>Domingo · 14h<br/>DJ Gorigamia</p></article><div className="programme-card"><Schedule /></div></div>
          : morePage === 'community' ? <div className="more-detail"><h2>Comunidade & acervos</h2><a className="menu-card" href="https://www.reddit.com/r/PCismoOnline/" target="_blank" rel="noopener noreferrer">Reddit · PCismoOnline<span>A comunidade do PCismo ↗</span></a><a className="menu-card" href="https://archive.org/details/@adoregabriel_antigo_" target="_blank" rel="noopener noreferrer">Internet Archive<span>Acervo @adoregabriel_antigo_ ↗</span></a><a className="menu-card" href="https://mamonasassassinas-archive.vercel.app/" target="_blank" rel="noopener noreferrer">Acervo Mamonas Assassinas<span>Explore o acervo ↗</span></a></div>
          : <div className="more-detail"><h2>Temas & informações</h2><label>Tema da rádio<select className="more-select" value={theme} onChange={e=>setTheme(e.target.value)}>{THEMES.map((id,i)=><option key={id} value={id}>{LABELS[i]}</option>)}</select></label><p>Automático acompanha manhã, tarde e noite.</p><article><h3>São Paulo</h3><p>{weather || 'Clima indisponível no momento'}</p><p>Estação: {season}</p><time dateTime={now.toISOString()}>{now.toLocaleDateString('pt-BR')} · {now.toLocaleTimeString('pt-BR')}</time></article></div>}

      </section>}
    </main>
    {tab !== 'radio' && <div className="mini-player"><button className="mini-track" onClick={()=>setTab('radio')} aria-label="Abrir player"><img src={track.cover || '/assets/fallback-cover.jpg'} alt=""/><span><strong>{track.title}</strong><small>{track.artist || 'Underplay Radio'}</small></span></button><button className="mini-play" onClick={togglePlay} aria-label={isPlaying?'Pausar rádio':'Tocar rádio'}>{isPlaying?'Ⅱ':'▶'}</button></div>}
    <nav className="bottom-navigation" aria-label="Navegação principal">{tabs.map(([id,label])=><button key={id} aria-current={tab===id?'page':undefined} onClick={()=>{setTab(id); window.scrollTo(0,0);}}><Icon name={id}/><span>{label}</span></button>)}</nav>
  </div></>;
}
export default function MobileApp() { return <PlayerProvider><MobileShell /></PlayerProvider>; }
