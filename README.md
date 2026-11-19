# Underplay Radio — repositório privado para Vercel

Código-fonte restaurado do site ao vivo em 19/11/2026 (HAR + backups). Não é uma reescrita: o build local reproduz o publicado com JS +0,09% e CSS +0,83%, DOM idêntico.

## Deploy na Vercel

1. Criar um repositório **privado** e enviar esta pasta para ele.
2. Vercel → Add New → Project → importar o repositório.
3. Framework: `Vite`; Install Command: `npm install`; Build Command: `npm run build`; Output Directory: `dist`; Node: `20.x`.
4. Deploy.

`vercel.json` replica as rotas que existiam no projeto antigo:

- `/listen/*` e `/hls/*` → `http://2.25.141.39` (stream AzuraCast/Icecast)
- `/status-json.xsl` → `http://2.25.141.39` (fallback de metadados)
- fallback de SPA → `/index.html` (rotas `/radio`, `/pedidos`, `/contato`)
- `/api/nowplaying/*`, `/api/station/*/requests` e `/api/station/*/request/*` são funções em `api/`

## Capas do player

Fluxo: `/api/nowplaying/underplayradio` (função que consulta o AzuraCast) devolve `song.art`; se a imagem falhar, `src/services/coverArtService.js` tenta a **API da Apple (iTunes Search)**, depois Deezer, MusicBrainz/Cover Art Archive e IGDB (opcional). O Firebase não participa das capas: ele só é usado no chat (`src/firebase.js`, `src/components/Chat.jsx`).

## Rodar localmente

```bash
npm install
npm run dev
```

`vite.config.js` faz proxy de `/listen`, `/hls`, `/api` e `/status-json.xsl` para `http://2.25.141.39`. Sem o proxy de `/api`, o player não recebe a música atual e mostra a capa fallback.

## Variáveis de ambiente

Todas são opcionais: o config público do Firebase já está embutido como fallback em `src/firebase.js`. Copie `.env.example` para `.env` apenas se quiser sobrescrever algo. **Nunca commite `.env`** — o backup original continha chaves reais.

- `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_DATABASE_URL`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`
- `VITE_IGDB_CLIENT_ID`, `VITE_IGDB_ACCESS_TOKEN` (capas de jogos; opcional)
- `VITE_LASTFM_KEY` existia no `.env` antigo, mas o código não a utiliza

## Arquivos incluídos

`src/`, `public/`, `api/`, `index.html`, `vite.config.js`, `vercel.json`, `package.json`, `package-lock.json`, `.env.example`, `.gitignore`, `README.md`.

Fora do repositório: `.env`, `node_modules/`, `dist/`, `build-live/`, HARs, zips e backups.

## Git

Este repositório foi criado localmente sem remote (a conta GitHub antiga foi comprometida). Para publicar:

```bash
git remote add origin <URL_DO_REPOSITORIO_PRIVADO>
git branch -M main
git push -u origin main
```
