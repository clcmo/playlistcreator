import { Provider } from './Provider.js';
import { Session } from '../models/Session.js';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT = `${location.origin}${import.meta.env.BASE_URL}`;
const API = 'https://api.spotify.com/v1';

const b64url = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)))
  .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

export class SpotifyProvider extends Provider {
  id = 'spotify';
  label = 'Spotify';

  isLoggedIn() { return !!Session.get(this.id); }

  // Authorization Code + PKCE (o fluxo implícito do projeto original foi descontinuado).
  async login() {
    const verifier = b64url(crypto.getRandomValues(new Uint8Array(32)));
    sessionStorage.setItem('pc.spotify.verifier', verifier);
    const challenge = b64url(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)));
    const p = new URLSearchParams({
      client_id: CLIENT_ID, response_type: 'code', redirect_uri: REDIRECT,
      scope: 'playlist-modify-public playlist-modify-private',
      code_challenge_method: 'S256', code_challenge: challenge
    });
    location.href = `https://accounts.spotify.com/authorize?${p}`;
  }

  async handleCallback(params) {
    const code = params.get('code');
    if (!code) return false;
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID, grant_type: 'authorization_code', code,
        redirect_uri: REDIRECT, code_verifier: sessionStorage.getItem('pc.spotify.verifier')
      })
    });
    const data = await res.json();
    if (!data.access_token) throw new Error('Falha no login do Spotify');
    Session.set(this.id, data.access_token, data.expires_in);
    return true;
  }

  async #call(path, init = {}) {
    const s = Session.get(this.id);
    if (!s) throw new Error('Sessão do Spotify expirada');
    const res = await fetch(`${API}${path}`, {
      ...init,
      headers: { Authorization: `Bearer ${s.token}`, 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) {
      const detail = data.error?.message || data.error?.reason || '';
      const hint = res.status === 403
        ? ' Se o app estiver em modo Development, confira Users and Access e se o proprietário tem Spotify Premium.'
        : '';
      throw new Error(`Spotify ${res.status}${detail ? `: ${detail}` : ''}.${hint}`);
    }
    return data;
  }

  async findTrack(track) {
    const q = encodeURIComponent(track.query);
    const data = await this.#call(`/search?q=${q}&type=track&limit=1`);
    return data.tracks?.items?.[0]?.uri ?? null;
  }

  async createPlaylist(name, uris) {
    // POST /me/playlists e /playlists/{id}/items: endpoints atuais (migração de fev/2026).
    const pl = await this.#call('/me/playlists', {
      method: 'POST', body: JSON.stringify({ name, public: false })
    });
    for (let i = 0; i < uris.length; i += 100) {
      await this.#call(`/playlists/${pl.id}/items`, {
        method: 'POST', body: JSON.stringify({ uris: uris.slice(i, i + 100) })
      });
    }
    return { url: pl.external_urls.spotify };
  }
}
