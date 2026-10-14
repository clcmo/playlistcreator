# Playlist Creator (React + PWA, MVC)

[![GitHub license](https://img.shields.io/github/license/urbanna/playlistcreator-example?style=for-the-badge)](https://github.com/urbanna/playlistcreator-example)
[![GitHub stars](https://img.shields.io/github/stars/urbanna/playlistcreator-example?style=for-the-badge)](https://github.com/urbanna/playlistcreator-example/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/urbanna/playlistcreator-example?style=for-the-badge)](https://github.com/urbanna/playlistcreator-example/network)
[![GitHub issues](https://img.shields.io/github/issues/urbanna/playlistcreator-example?style=for-the-badge)](https://github.com/urbanna/playlistcreator-example/issues)

## Rodar

    cp .env.example .env   # preencha as chaves
    npm install
    npm run server &       # BFF (Deezer)
    npm run dev

## Arquitetura (MVC)

- **Model** `src/models` — Track (entrada do usuário) e Session (tokens por provedor)
- **Providers** `src/providers` — um adaptador por serviço (mesmo contrato `Provider`)
- **Controller** `src/controllers` — AuthController (SSO/callbacks) e PlaylistController (orquestra)
- **View** `src/views` — componentes React, sem regra de negócio
- **BFF** `server/` — secret do Deezer + proxy (CORS)

## Instalar no celular
PWA: `npm run build`, publique em HTTPS e use "Adicionar à tela inicial".
Ícones provisórios em `public/` (troque pelos definitivos mantendo os nomes).
Para loja (Play/App Store): empacotar o build com Capacitor.

## Deploy (GitHub Pages)
O workflow `.github/workflows/deploy.yml` publica a cada push na `master`/`main`:
- `/` página inicial semidinâmica (versão atual, changelog, histórico de releases)
- `/app/` o PWA
- tag `vX.Y.Z` + Release com o zip do app (X.Y vem do `package.json`; Z é o nº da execução)

Configuração única: Settings > Pages > Source = "GitHub Actions", e em
Settings > Secrets and variables > Actions > **Variables**, cadastre
`VITE_SPOTIFY_CLIENT_ID`, `VITE_GOOGLE_CLIENT_ID`, `VITE_DEEZER_APP_ID` e `VITE_BFF_URL`.
O `server/` (Deezer) não roda no Pages: hospede-o à parte e aponte `VITE_BFF_URL` para ele.

## Redirect URIs a cadastrar

O retorno do login cai na raiz do app: `https://SEU_DOMINIO[/repo]/app/` (com a barra final), no Spotify e no Deezer.
(As linhas abaixo valem só para desenvolvimento local.)

- Spotify: `https://SEU_DOMINIO/callback/spotify` (em dev: `http://127.0.0.1:5173/callback/spotify`)
- Deezer: `https://SEU_DOMINIO/callback/deezer`
- Google: origem JavaScript autorizada `https://SEU_DOMINIO`
