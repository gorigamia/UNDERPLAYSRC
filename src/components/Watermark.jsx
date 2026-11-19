import styles from './Watermark.module.css'

export default function Watermark() {
  return (
    <div className={styles.watermark} aria-hidden="true">
      UNDER
    </div>
  )
}
