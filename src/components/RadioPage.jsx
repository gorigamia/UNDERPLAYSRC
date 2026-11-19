import { useState } from 'react';
import Player from './Player';
import ChatAoVivo from './Chat';
import SongRequests from './SongRequests';
import Schedule from './Schedule';
import IntroScreen from './IntroScreen';
import styles from '../App.module.css';
import radioStyles from './RadioPage.module.css';

export default function RadioPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'requests'

  return (
    <>
      {showIntro && <IntroScreen onFinish={() => setShowIntro(false)} />}
      <Schedule />
      <main className={styles.main}>
        <div className={styles.homeRow}>
          <Player />
          
          <div className={radioStyles.sidePanel}>
            <div className={radioStyles.tabBar}>
              <button
                className={`${radioStyles.tabBtn} ${activeTab === 'chat' ? radioStyles.activeTab : ''}`}
                onClick={() => setActiveTab('chat')}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Chat ao Vivo
              </button>

              <button
                className={`${radioStyles.tabBtn} ${activeTab === 'requests' ? radioStyles.activeTab : ''}`}
                onClick={() => setActiveTab('requests')}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18V5l12-2v13"/>
                  <circle cx="6" cy="18" r="3"/>
                  <circle cx="18" cy="16" r="3"/>
                </svg>
                Pedir Música
              </button>
            </div>

            <div className={radioStyles.tabContent}>
              {activeTab === 'chat' ? <ChatAoVivo /> : <SongRequests />}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
