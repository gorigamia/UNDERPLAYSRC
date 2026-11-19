// Contato.jsx
import styles from './Contato.module.css';

export default function Contato() {
  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    await fetch('https://formspree.io/f/xredvpke', {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });
    alert('Mensagem enviada!');
  }
  return (
    <main className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.label}>
          Fale conosco ou mande email para{' '}
          <a href="mailto:gorigamia.clips@gmail.com" style={{ color: 'inherit', textDecoration: 'underline' }}>
            gorigamia.clips@gmail.com
          </a>
        </span>
        <h1 className={styles.title}>CONTATO</h1>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Nome</label>
            <input
              name="name"
              className={styles.input}
              type="text"
              placeholder="Seu nome"
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>E-mail</label>
            <input
              name="email"
              className={styles.input}
              type="email"
              placeholder="seu@email.com"
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel}>Assunto</label>
          <input
            className={styles.input}
            name="assunto"
            type="text"
            placeholder="Sobre o que você quer falar?"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel}>Mensagem</label>
          <textarea
            name="message"
            className={styles.textarea}
            rows={5}
            placeholder="Escreva sua mensagem..."
            required
          />
        </div>

        <button className={styles.btn} type="submit">
          Enviar mensagem
        </button>
      </form>
    </main>
  );
}
