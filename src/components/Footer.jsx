import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.contentRow}>
        <div className={styles.sloganBadge}>
          <span className={styles.sloganDot} aria-hidden="true" />
          <span className={styles.sloganText}>Voltamos pra Ficar!</span>
        </div>

        <p className={styles.credits}>
          Underplay Radio &copy; 2018–2026 · Feito por <strong>Gorigamia</strong>, <strong>NightX</strong> e <strong>Neitas</strong> em 2026
        </p>

        <span className={styles.freq}>
          <span className={styles.liveDot} aria-hidden="true" />
          Online · 128kbps Icecast · BR
        </span>
      </div>

      <p className={styles.disclaimer}>
        Projeto comunitário próprio e fechado sem fins lucrativos, operando sob uso justo (Fair Use) para entretenimento da comunidade de PC Gaming.
      </p>
    </footer>
  );
}
