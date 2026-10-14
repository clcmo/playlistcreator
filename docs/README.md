# Playlist Creator (React + PWA, MVC)

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
Adicione `public/icon-192.png` e `public/icon-512.png`.
Para loja (Play/App Store): empacotar o build com Capacitor.

## Redirect URIs a cadastrar

- Spotify: `https://SEU_DOMINIO/callback/spotify` (em dev: `http://127.0.0.1:5173/callback/spotify`)
- Deezer: `https://SEU_DOMINIO/callback/deezer`
- Google: origem JavaScript autorizada `https://SEU_DOMINIO`
