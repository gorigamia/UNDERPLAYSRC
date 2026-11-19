import styles from './SubNav.module.css';

export default function SubNav() {
  return (
    <div className={styles.subnav}>
      <div />
      <span className={styles.center}>Ao vivo</span>
      <div className={styles.right}>
        {/* <span>⊞</span>
        <span>↗</span> */}
      </div>
    </div>
  );
}
