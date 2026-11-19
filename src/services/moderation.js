/**
 * Serviço de Moderação, Filtro Anti-Spam/Flood e Validação de Perfis
 * Underplay Radio - "Voltamos pra Ficar!"
 */

// 1. LISTA DE MEMES E TERMOS DA COMUNIDADE AUTORIZADOS (WHITELIST)
export const COMMUNITY_MEMES = [
  'meme do caixão',
  'meme do caixao',
  'meme do terno',
  'cruzeirense',
  'aqui diz que é mentira',
  'aqui diz que e mentira',
  'gigacaga',
  'gigabomba',
  'tico-tico',
  'tico tico',
  'oi oi oi',
  'quim barreiros',
  'se abriu é porque roda',
  'se abriu e porque roda',
  'linux resolve tudo',
  'eu não sei andar na cidade',
  'eu nao sei andar na cidade',
  'linux resolve até sua mãe',
  'linux resolve ate sua mae',
];

// 2. PADRÕES DE TERMOS PROIBIDOS (BLACKLIST)
const FORBIDDEN_WORDS = [
  // Palavrões gerais, genitais, pornografia e alusões sexuais
  'porno', 'porn', 'hentai', 'xvideos', 'redtube', 'onlyfans', 'fatalmodel',
  'puta', 'puto', 'putaria', 'putinha', 'putona', 'putedo',
  'caralho', 'krl', 'krai', 'cacete', 'buceta', 'bct', 'bucetinha', 'bucetao',
  'penis', 'pauzao', 'pinto', 'rola', 'caralhao', 'xoxota', 'xexeca',
  'foder', 'fodeu', 'fudilho', 'fodase', 'foda-se', 'fodete', 'fudido', 'fudida',
  'chupa', 'chupada', 'boquete', 'boqueteiro', 'siririca', 'punheta', 'punheteiro',
  'arrombado', 'arrombada', 'arrombar', 'cuzao', 'cuzinho', 'cusao', 'travecar',

  // Incitação ao ódio, preconceito a minorias, capacitismo e peso
  'viado', 'viadinho', 'bicha', 'boiola', 'sapatao', 'traveco', 'travesti lixo',
  'macaco', 'preto imundo', 'negro lixo', 'nazista', 'hitler', 'suastica',
  'estupro', 'estuprador', 'estupra', 'retardado', 'retardada', 'down',
  'aleijado', 'aleijada', 'anormal', 'baleia assassina', 'gordo imundo', 'gorda asquerosa',
  'pedofilo', 'pedofilia', 'pedofilo maldito',

  // Política e controvérsia partidária / difamação institucional
  'bolsonaro', 'lula', 'bolsopetista', 'petista', 'bolsonarista', 'comunista lixo',
  'fascista', 'golpista', 'ptralha', 'corrupto ladrao', 'bancada da bala',
  'bradesco ladrao', 'itau ladrao', 'santander corrupto', 'banco ladrao',
  'molesta', 'molestar', 'estuprador de hardware'
];

/**
 * Normaliza leetspeak e caracteres especiais para evitar bypass
 */
export function normalizeLeetSpeak(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[@4]/g, 'a')
    .replace(/3/g, 'e')
    .replace(/[1!|]/g, 'i')
    .replace(/0/g, 'o')
    .replace(/[5$]/g, 's')
    .replace(/7/g, 't')
    .replace(/8/g, 'b');
}

/**
 * 3. DETECÇÃO DE SPAM, FLOOD E LETRAS ALEATÓRIAS (GIBBERISH)
 */
export function checkSpamAndFlood(rawText, sendHistory = [], lastMessageText = '') {
  const now = Date.now();
  const trimmed = rawText.trim();

  // 1. Verificar mensagens muito rápidas em curto período (Burst Rate Limiting: máx 3 msgs a cada 5s)
  const recentSends = sendHistory.filter((t) => now - t < 5000);
  if (recentSends.length >= 3) {
    return {
      isSpam: true,
      reason: 'Você está enviando mensagens rápido demais. Aguarde alguns segundos.',
    };
  }

  // 2. Bloqueio de Mensagens Duplicadas Consecutivas
  if (lastMessageText && trimmed.toLowerCase() === lastMessageText.trim().toLowerCase()) {
    return {
      isSpam: true,
      reason: 'Evite enviar a mesma mensagem repetidamente.',
    };
  }

  // 3. Flood de caracteres repetidos excessivamente (ex: aaaaaaaaaaaaaa, kkkkkkkkkkkkkkkkkkkkk)
  // Permite risadas moderadas mas reduz ou bloqueia repetições de mais de 10 caracteres idênticos seguidos
  if (/(.)\1{9,}/i.test(trimmed)) {
    return {
      isSpam: true,
      reason: 'Mensagem contém repetição excessiva de caracteres (flood).',
    };
  }

  // 4. Detecção de Teclado / Letras aleatórias sem sentido (Keyboard smashing / gibberish)
  // Sequência de 8 ou mais consoantes consecutivas sem vogal ou padrão natural (ex: asdfghjklñ, zxcvbnmasd)
  const isMemeException = COMMUNITY_MEMES.some((meme) =>
    normalizeLeetSpeak(trimmed).includes(normalizeLeetSpeak(meme))
  );

  if (!isMemeException) {
    const consonantMashRegex = /[bcdfghjklmnpqrstvwxyz]{8,}/i;
    if (consonantMashRegex.test(trimmed.replace(/\s+/g, ''))) {
      return {
        isSpam: true,
        reason: 'Evite spam de letras aleatórias no chat.',
      };
    }
  }

  // 5. Flood de quebras de linha ou caracteres invisíveis
  const lineBreaks = (trimmed.match(/\n/g) || []).length;
  if (lineBreaks > 3) {
    return {
      isSpam: true,
      reason: 'Mensagem contém muitas quebras de linha.',
    };
  }

  return { isSpam: false, reason: null };
}

/**
 * 4. FILTRO DE PALAVRAS E OFENSAS
 */
export function filterMessage(rawText, censorMode = true) {
  if (!rawText || typeof rawText !== 'string') {
    return { isValid: false, sanitizedText: '', errorReason: 'Mensagem inválida.' };
  }

  // Colapsa repetições de caracteres excessivas (ex: "oooiiii" -> "oii")
  let trimmed = rawText.trim().replace(/(.)\1{4,}/g, '$1$1$1');
  if (!trimmed) {
    return { isValid: false, sanitizedText: '', errorReason: 'Mensagem vazia.' };
  }

  let textNormalized = normalizeLeetSpeak(trimmed);
  let sanitized = trimmed;

  // 1. Proteger e Isolar Memes da Comunidade com Tokens Seguros
  const preservedMemeTokens = [];
  COMMUNITY_MEMES.forEach((meme, index) => {
    const normMeme = normalizeLeetSpeak(meme);
    if (textNormalized.includes(normMeme)) {
      const token = `__UP_MEME_${index}__`;
      const escaped = meme.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'gi');

      sanitized = sanitized.replace(regex, token);
      textNormalized = textNormalized.replace(new RegExp(normMeme, 'g'), token);
      preservedMemeTokens.push({ token, original: meme });
    }
  });

  // 2. Verificar Palavras Proibidas
  let hasBlockedTerm = false;

  for (const word of FORBIDDEN_WORDS) {
    const wordPattern = new RegExp(`\\b${word}\\b`, 'gi');
    if (wordPattern.test(textNormalized)) {
      hasBlockedTerm = true;
      if (!censorMode) {
        return {
          isValid: false,
          sanitizedText: '',
          errorReason: 'Sua mensagem contém termos impróprios ou restritos.',
        };
      }
      const maskRegex = new RegExp(`\\b${word}\\b`, 'gi');
      sanitized = sanitized.replace(maskRegex, (match) => '*'.repeat(match.length));
    }
  }

  // 3. Restaurar Tokens dos Memes Protegidos
  preservedMemeTokens.forEach(({ token, original }) => {
    sanitized = sanitized.replace(new RegExp(token, 'g'), original);
  });

  return {
    isValid: censorMode ? true : !hasBlockedTerm,
    sanitizedText: sanitized,
    errorReason: hasBlockedTerm && !censorMode ? 'Mensagem bloqueada pelo filtro de moderação.' : null,
  };
}

/**
 * 5. VALIDAÇÃO DE NICKNAME
 */
export function validateNickname(nick) {
  if (!nick || typeof nick !== 'string') {
    return { isValid: false, reason: 'O apelido não pode estar vazio.' };
  }

  const trimmed = nick.trim();

  if (trimmed.length < 3 || trimmed.length > 20) {
    return { isValid: false, reason: 'O apelido deve ter entre 3 e 20 caracteres.' };
  }

  // Apenas alfanuméricos e sublinhado (sem espaços, sem frases, sem trocadilhos)
  const regexValidChars = /^[a-zA-Z0-9_]+$/;
  if (!regexValidChars.test(trimmed)) {
    return {
      isValid: false,
      reason: 'Use apenas letras, números e sublinhado (_). Sem espaços ou frases.',
    };
  }

  // Verificar na Blacklist
  const normalized = normalizeLeetSpeak(trimmed);
  for (const word of FORBIDDEN_WORDS) {
    if (normalized.includes(word)) {
      return { isValid: false, reason: 'Este apelido contém termos impróprios ou restritos.' };
    }
  }

  return { isValid: true, sanitizedNick: trimmed, reason: null };
}

// 6. PRESETS SEGUROS DE FOTO DE PERFIL / AVATAR
export const AVATAR_PRESETS = [
  '🎧 Ouvinte',
  '📻 Retrô',
  '⚡ Neon',
  '🎸 Rock',
  '👾 Gamer',
  '🔥 Beat',
  '🐧 Linux',
  '🐱 CyberCat',
  '🛸 Synth',
];

export function validateAvatar(avatar) {
  if (!avatar) return { isValid: true, avatar: AVATAR_PRESETS[0] };

  if (AVATAR_PRESETS.includes(avatar)) {
    return { isValid: true, avatar };
  }

  const urlPattern = /^https:\/\/[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+\.(jpg|jpeg|png|webp|svg|gif)$/i;
  if (urlPattern.test(avatar) && avatar.length <= 150) {
    return { isValid: true, avatar };
  }

  return { isValid: false, reason: 'Avatar inválido. Selecione um dos avatares disponíveis.' };
}
