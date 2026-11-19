import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { db, ensureAuth } from '../firebase';
import { ref, push, onValue, query, limitToLast } from 'firebase/database';
import {
  filterMessage,
  checkSpamAndFlood,
  validateNickname,
  validateAvatar,
  AVATAR_PRESETS,
} from '../services/moderation';
import styles from './Chat.module.css';

function useDebounced(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
});

function formatTime(ts) {
  if (!ts) return '';
  try {
    return timeFormatter.format(new Date(ts));
  } catch {
    return '';
  }
}

// Subcomponente individual de mensagem
const MessageItem = memo(function MessageItem({ msg, isMine }) {
  return (
    <div className={`${styles.msg} ${isMine ? styles.mine : ''}`}>
      <div className={styles.msgMeta}>
        <span className={styles.msgAvatar}>{msg.avatar || '🎧'}</span>
        <span className={styles.msgUser}>{msg.user}</span>
        <span className={styles.msgTime}>{msg.formattedTime || formatTime(msg.time)}</span>
      </div>
      <div className={styles.msgBubble}>{msg.text}</div>
    </div>
  );
});

// Barra de edição e exibição de Nickname e Avatar
const ChatNameBar = memo(function ChatNameBar({ username, avatar, onSaveProfile }) {
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [avatarInput, setAvatarInput] = useState(avatar);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (editing) {
      setNameInput(username);
      setAvatarInput(avatar);
      setLocalError(null);
    }
  }, [editing, username, avatar]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nickCheck = validateNickname(nameInput);
    if (!nickCheck.isValid) {
      setLocalError(nickCheck.reason);
      return;
    }

    const avatarCheck = validateAvatar(avatarInput);
    if (!avatarCheck.isValid) {
      setLocalError(avatarCheck.reason);
      return;
    }

    onSaveProfile(nickCheck.sanitizedNick, avatarCheck.avatar);
    setEditing(false);
    setLocalError(null);
  };

  return (
    <div className={styles.nameBar}>
      {editing ? (
        <form className={styles.nameForm} onSubmit={handleSubmit}>
          <div className={styles.profileEditRow}>
            <select
              className={styles.avatarSelect}
              value={avatarInput}
              onChange={(e) => setAvatarInput(e.target.value)}
              title="Escolha seu avatar"
            >
              {AVATAR_PRESETS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <input
              className={styles.nameInput}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Seu_Nick (3 a 20 carac.)"
              maxLength={20}
              autoFocus
            />
          </div>
          {localError && <span className={styles.validationError}>{localError}</span>}
          <div className={styles.btnRow}>
            <button className={styles.nameBtn} type="submit">
              Salvar
            </button>
            <button
              className={styles.nameBtnCancel}
              type="button"
              onClick={() => setEditing(false)}
              aria-label="Cancelar"
            >
              ✕
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.nameDisplay}>
          <span className={styles.currentAvatar}>{avatar}</span>
          <span className={styles.nameValue}>{username || 'Defina seu nome'}</span>
          <button
            className={styles.nameEdit}
            onClick={() => setEditing(true)}
            title="Editar nick e avatar"
            aria-label="Editar nick e avatar"
          >
            ✎
          </button>
        </div>
      )}
    </div>
  );
});

// Input de envio com filtro e cooldown
const ChatInput = memo(function ChatInput({ onSend, hasNickname, isConnected }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanText = text.trim();
    if (!cleanText) return;
    onSend(cleanText);
    setText('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={!hasNickname ? 'Defina seu nome no lápis para escrever...' : !isConnected ? 'Aguardando conexão...' : 'Manda uma mensagem...'}
        maxLength={200}
        disabled={!hasNickname || !isConnected}
        autoComplete="off"
      />
      <button
        className={styles.sendBtn}
        type="submit"
        disabled={!text.trim() || !hasNickname || !isConnected}
        aria-label="Enviar mensagem"
      >
        <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
          <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M22 2L15 22L11 13L2 9L22 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
});

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [sendHistory, setSendHistory] = useState([]);
  const [lastSentText, setLastSentText] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [rawConnected, setRawConnected] = useState(true);
  const isConnected = useDebounced(rawConnected, 8000);

  const [profile, setProfile] = useState(() => {
    const savedNick = sessionStorage.getItem('underplay_username') || '';
    const savedAvatar = sessionStorage.getItem('underplay_avatar') || AVATAR_PRESETS[0];
    return { nick: savedNick, avatar: savedAvatar };
  });

  const listRef = useRef(null);

  useEffect(() => {
    if (!db) {
      setErrorMsg('Chat indisponível: configuração do Firebase ausente.');
      setRawConnected(false);
      return;
    }

    ensureAuth().catch(() => {});

    const connectedRef = ref(db, '.info/connected');
    const unsubConnected = onValue(connectedRef, (snap) => {
      setRawConnected(Boolean(snap.val()));
    });

    const chatRef = query(ref(db, 'chat'), limitToLast(50));
    const unsubMessages = onValue(
      chatRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setMessages([]);
          return;
        }

        const loaded = [];
        snapshot.forEach((child) => {
          const val = child.val() || {};
          loaded.push({
            id: child.key,
            user: val.user || 'Ouvinte',
            avatar: val.avatar || '🎧',
            text: val.text || '',
            time: val.time || Date.now(),
            formattedTime: formatTime(val.time),
          });
        });

        setMessages(loaded);
      },
      (err) => {
        console.error('Firebase DB Error:', err);
        setErrorMsg('Erro ao carregar mensagens. Verifique sua conexão.');
      }
    );

    return () => {
      unsubMessages();
      unsubConnected();
    };
  }, []);

  // Rolagem suave e instantânea
  useEffect(() => {
    const container = listRef.current;
    if (!container) return;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
    if (isNearBottom || container.scrollTop === 0) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const handleSend = useCallback(
    async (rawText) => {
      if (!profile.nick) {
        setErrorMsg('Defina seu nome no ícone de lápis antes de escrever.');
        return;
      }

      if (!isConnected) {
        setErrorMsg('Sem conexão com o servidor. Aguarde a reconexão...');
        return;
      }

      const now = Date.now();

      // 1. Checagem de Anti-Spam e Anti-Flood
      const spamCheck = checkSpamAndFlood(rawText, sendHistory, lastSentText);
      if (spamCheck.isSpam) {
        setErrorMsg(spamCheck.reason);
        return;
      }

      // 2. Aplica Filtro de Moderação
      const { isValid, sanitizedText, errorReason } = filterMessage(rawText, true);
      if (!isValid) {
        setErrorMsg(errorReason || 'Mensagem bloqueada pelo filtro.');
        return;
      }

      try {
        if (!db) {
          setErrorMsg('Chat indisponível: configuração do Firebase ausente.');
          return;
        }
        const user = await ensureAuth().catch(() => null);
        if (!user) {
          setErrorMsg('Falha na autenticação. Recarregue a página (F5) e tente novamente.');
          return;
        }

        await push(ref(db, 'chat'), {
          user: profile.nick.slice(0, 20),
          avatar: profile.avatar.slice(0, 50),
          text: sanitizedText.slice(0, 200),
          time: now,
        });

        setSendHistory((prev) => [...prev.slice(-6), now]);
        setLastSentText(sanitizedText);
        setErrorMsg(null);

        if (listRef.current) {
          listRef.current.scrollTop = listRef.current.scrollHeight;
        }
      } catch (err) {
        console.error('Erro ao enviar mensagem:', err);
        if (err.code === 'PERMISSION_DENIED') {
          setErrorMsg('Permissão negada. As regras do banco de dados do Firebase podem estar bloqueando o envio.');
        } else {
          setErrorMsg('Erro ao enviar. Verifique sua conexão e tente novamente.');
        }
      }
    },
    [sendHistory, lastSentText, profile, isConnected]
  );

  const handleSaveProfile = useCallback((newNick, newAvatar) => {
    setProfile({ nick: newNick, avatar: newAvatar });
    sessionStorage.setItem('underplay_username', newNick);
    sessionStorage.setItem('underplay_avatar', newAvatar);
  }, []);

  return (
    <div className={styles.chat}>
      <div className={styles.chatHeader}>
        <span className={`${styles.dot} ${isConnected ? styles.online : styles.offline}`} />
        <span className={styles.label}>{isConnected ? 'Chat ao vivo' : 'Offline'}</span>
        <span className={styles.count}>{messages.length} msgs</span>
      </div>

      <ChatNameBar
        username={profile.nick}
        avatar={profile.avatar}
        onSaveProfile={handleSaveProfile}
      />

      <div ref={listRef} className={styles.messages}>
        {errorMsg && (
          <div className={styles.errorBanner} onClick={() => setErrorMsg(null)} title="Clique para fechar">
            {errorMsg}
          </div>
        )}
        {messages.map((msg) => (
          <MessageItem key={msg.id} msg={msg} isMine={msg.user === profile.nick} />
        ))}
      </div>

      <ChatInput onSend={handleSend} hasNickname={Boolean(profile.nick)} isConnected={isConnected} />
    </div>
  );
}
