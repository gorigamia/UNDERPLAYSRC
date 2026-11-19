import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Landing.module.css';

// URLs completas — são copiadas para uso em AIMP, VLC e outros players externos.
const STREAM_URL = 'http://2.25.141.39/listen/underplayradio/radio.mp3';
const STREAM_HLS = 'http://2.25.141.39/hls/underplayradio/live.m3u8';
const STREAM_M3U = '/public/underplayradio/playlist.m3u';
const STREAM_PLS = '/public/underplayradio/playlist.pls';
const RADIOSNET_URL = 'https://www.radios.com.br/aovivo/underplay/172862';
// URLs diretas para configurações de jogos e players externos.
const ETS2_LINE = 'stream_data[]: "http://2.25.141.39/listen/underplayradio/radio.mp3|Underplay Radio|Games / Pop / Tech|PT|192|1"';
const ATS_LINE = ETS2_LINE;
const FARMING_SIM_XML = '<streamingInternetRadio name="Underplay Radio" url="http://2.25.141.39/listen/underplayradio/radio.mp3" />';

async function copyToClipboard(text) {
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn("navigator.clipboard falhou, usando fallback:", err);
    }
  }

  // Fallback universal para navegadores antigos ou restrições de permissão
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error("Fallback de cópia falhou:", err);
    return false;
  }
}

export default function Landing({ section = 'all', onListen }) {
  const [copiedStream, setCopiedStream] = useState(false);
  const [copiedHls, setCopiedHls] = useState(false);
  const [copiedEts2, setCopiedEts2] = useState(false);
  const [copiedAts, setCopiedAts] = useState(false);
  const [copiedFarmingSim, setCopiedFarmingSim] = useState(false);

  const handleCopyStream = async () => {
    const success = await copyToClipboard(STREAM_URL);
    if (success !== false) {
      setCopiedStream(true);
      setTimeout(() => setCopiedStream(false), 2500);
    }
  };

  const handleCopyHls = async () => {
    const success = await copyToClipboard(STREAM_HLS);
    if (success !== false) {
      setCopiedHls(true);
      setTimeout(() => setCopiedHls(false), 2500);
    }
  };

  const handleCopyEts2 = async () => {
    const success = await copyToClipboard(ETS2_LINE);
    if (success !== false) {
      setCopiedEts2(true);
      setTimeout(() => setCopiedEts2(false), 2500);
    }
  };

  const handleCopyGameConfig = async (text, setCopied) => {
    const success = await copyToClipboard(text);
    if (success !== false) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className={styles.landing}>
      {/* Hero Section */}
      {(section === 'all' || section === 'about') && <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.originBadge}>
            <span className={styles.originTag}>VOLTAMOS PRA FICAR!</span>
            <span>Desde 2018 · Criada por <strong>gorigamia</strong> para a comunidade de PC Games & boa música</span>
          </div>

          <h1 className={styles.title}>
            A Rádio Oficial do <span className={styles.highlight}>PCismo</span>
          </h1>
          <p className={styles.subtitle}>
            Música ininterrupta 24 horas por dia para embalar suas gameplays, maratonas de código, viagens na estrada e discussões sobre hardware.
          </p>

          <div className={styles.ctaGroup}>
            <Link to="/radio" className={styles.ctaBtn} onClick={onListen}>
              SINTONIZAR NO NAVEGADOR
            </Link>
            <a
              href={RADIOSNET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryBtn}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
              OUVIR NO RADIOSNET
            </a>
          </div>
        </div>
      </div>

      }
      {/* Seção Ouça em Qualquer Player de PC */}
      {(section === 'all' || section === 'players') && <section className={styles.externalPlayersSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>PLAYERS EXTERNOS</span>
          <h2 className={styles.sectionTitle}>OUÇA EM QUALQUER PLAYER</h2>
          <p className={styles.sectionSubtitle}>
            Toque a Underplay direto no seu reprodutor de áudio preferido no PC (AIMP, Winamp, Windows Media Player, VLC e outros).
          </p>
        </div>

        <div className={styles.playerIconsGrid}>
          {/* AIMP */}
          <div className={styles.playerBadgeCard}>
            <div className={`${styles.playerIcon} ${styles.iconAimp}`}>
              <img src="/assets/aimp.svg" alt="AIMP" width="40" height="40" />
            </div>
            <span className={styles.playerName}>AIMP</span>
          </div>

          {/* Winamp */}
          <div className={styles.playerBadgeCard}>
            <div className={`${styles.playerIcon} ${styles.iconWinamp}`}>
              <img src="/assets/winamp.svg" alt="Winamp" width="40" height="40" />
            </div>
            <span className={styles.playerName}>Winamp</span>
          </div>

          {/* Windows Media Player */}
          <div className={styles.playerBadgeCard}>
            <div className={`${styles.playerIcon} ${styles.iconWmp}`}>
              <img src="/assets/wmp.svg" alt="Windows Media Player" width="40" height="40" />
            </div>
            <span className={styles.playerName}>Windows Media Player</span>
          </div>

          {/* VLC / Outros */}
          <div className={styles.playerBadgeCard}>
            <div className={`${styles.playerIcon} ${styles.iconVlc}`}>
              <img src="/assets/vlc.svg" alt="VLC media player" width="40" height="40" />
            </div>
            <span className={styles.playerName}>VLC media player</span>
          </div>
        </div>

        <div className={styles.downloadLinksRow}>
          <a href={STREAM_M3U} target="_blank" rel="noopener noreferrer" className={styles.actionBtn}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Baixar Lista .M3U
          </a>

          <a href={STREAM_PLS} target="_blank" rel="noopener noreferrer" className={styles.actionBtn}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Baixar Lista .PLS
          </a>

          <button onClick={handleCopyStream} className={`${styles.actionBtn} ${copiedStream ? styles.actionBtnSuccess : ''}`}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copiedStream ? '✓ Link Copiado!' : 'Copiar URL Icecast'}
          </button>

          <button onClick={handleCopyHls} className={`${styles.actionBtn} ${copiedHls ? styles.actionBtnSuccess : ''}`}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copiedHls ? '✓ Link Copiado!' : 'Copiar URL HLS'}
          </button>
        </div>
      </section>}

      {(section === 'all' || section === 'games') && <section className={styles.gamesSection}>
        <div className={styles.gamesHeader}>
          <span className={styles.ets2Badge}>GAMING & SIMULADORES</span>
          <h2 className={styles.sectionTitle}>RÁDIO DENTRO DO JOGO</h2>
          <p className={styles.sectionSubtitle}>
            Adicione a Underplay aos jogos que aceitam rádios online nativamente e continue ouvindo enquanto joga.
          </p>
        </div>

        <div className={styles.gameGrid}>
          <article className={styles.gameCard}>
            <div className={`${styles.gameLogo} ${styles.gameLogoScs}`} aria-hidden="true">SCS</div>
            <div className={styles.gameCardBody}>
              <span className={styles.gameSeries}>SCS SOFTWARE</span>
              <h3>Euro Truck Simulator 2</h3>
              <p>Adicione no arquivo <code>live_streams.sii</code> e escute no rádio do caminhão.</p>
              <code className={styles.gameCode}>{ETS2_LINE}</code>
              <button onClick={handleCopyEts2} className={`${styles.ets2CopyBtn} ${copiedEts2 ? styles.ets2Copied : ''}`}>
                {copiedEts2 ? 'Copiado!' : 'Copiar configuração ETS2'}
              </button>
            </div>
          </article>

          <article className={styles.gameCard}>
            <div className={`${styles.gameLogo} ${styles.gameLogoScs}`} aria-hidden="true">ATS</div>
            <div className={styles.gameCardBody}>
              <span className={styles.gameSeries}>SCS SOFTWARE</span>
              <h3>American Truck Simulator</h3>
              <p>Use a mesma linha no arquivo <code>live_streams.sii</code> do ATS.</p>
              <code className={styles.gameCode}>{ATS_LINE}</code>
              <button onClick={() => handleCopyGameConfig(ATS_LINE, setCopiedAts)} className={`${styles.ets2CopyBtn} ${copiedAts ? styles.ets2Copied : ''}`}>
                {copiedAts ? 'Copiado!' : 'Copiar configuração ATS'}
              </button>
            </div>
          </article>

          <article className={styles.gameCard}>
            <div className={`${styles.gameLogo} ${styles.gameLogoFs}`} aria-hidden="true">FS</div>
            <div className={styles.gameCardBody}>
              <span className={styles.gameSeries}>GIANTS SOFTWARE</span>
              <h3>Farming Simulator 22 / 25</h3>
              <p>Cadastre a rádio no arquivo <code>streamingInternetRadios.xml</code>.</p>
              <code className={styles.gameCode}>{FARMING_SIM_XML}</code>
              <button onClick={() => handleCopyGameConfig(FARMING_SIM_XML, setCopiedFarmingSim)} className={`${styles.ets2CopyBtn} ${copiedFarmingSim ? styles.ets2Copied : ''}`}>
                {copiedFarmingSim ? 'Copiado!' : 'Copiar configuração Farming'}
              </button>
            </div>
          </article>
        </div>
      </section>}

      {/* Principais Destaques & Recursos */}
      {(section === 'all' || section === 'about') && <div className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.icon}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="22"/>
            </svg>
          </div>
          <h3>Ao Vivo 24/7</h3>
          <p>Nossa transmissão nunca para. Sempre que você ligar o PC ou iniciar sua gameplay, a rádio estará pronta no ar sem interrupções.</p>
        </div>
        
        <div className={styles.featureCard}>
          <div className={styles.icon}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h3>Chat ao Vivo</h3>
          <p>Converse em tempo real com ouvintes e gamers. Tire dúvidas de setup, mande um salve e participe ativamente da comunidade.</p>
        </div>
        
        <div className={styles.featureCard}>
          <div className={styles.icon}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
            </svg>
          </div>
          <h3>128kbps Icecast</h3>
          <p>Transmissão otimizada via Icecast a 128kbps em codec leve e cristalino, garantindo estabilidade máxima sem engasgos de conexão.</p>
        </div>
      </div>}
    </div>
  );
}

