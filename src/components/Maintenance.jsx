import styles from './Maintenance.module.css';
import logo from '../logo/logo.png';
import WeatherBackground from './WeatherBackground';

export default function Maintenance() {
  return (
    <div className={styles.maintenanceLayout}>
      <WeatherBackground forceTime="night" />
      
      <div className={styles.content}>
        <img src={logo} alt="Underplay Radio" className={styles.logo} />
        <h1 className={styles.title}>Servidores em Manutenção</h1>
        <p className={styles.subtitle}>
          Estamos aplicando atualizações na nossa infraestrutura de áudio e chat. 
          A rádio mais tech da internet volta ao ar em instantes.
        </p>
        <div className={styles.loader}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}
