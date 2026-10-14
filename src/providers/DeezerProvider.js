import { Provider } from './Provider.js';
import { Session } from '../models/Session.js';

const APP_ID = import.meta.env.VITE_DEEZER_APP_ID;
const BFF = import.meta.env.VITE_BFF_URL;
const REDIRECT = `${location.origin}${import.meta.env.BASE_URL}`;

// A API do Deezer não libera CORS e a troca do código exige o app secret:
// tudo passa pelo servidor (BFF) em /server.
export class DeezerProvider extends Provider {
  id = 'deezer';
  label = 'Deezer';

  isLoggedIn() { return !!Session.get(this.id); }

  login() {
    const p = new URLSearchParams({ app_id: APP_ID, redirect_uri: REDIRECT, perms: 'manage_library' });
    location.href = `https://connect.deezer.com/oauth/auth.php?${p}`;
  }

  async handleCallback(params) {
    const code = params.get('code');
    if (!code) return false;
    const res = await fetch(`${BFF}/auth/deezer/token?code=${encodeURIComponent(code)}`);
    const data = await res.json();
    if (!data.access_token) throw new Error('Falha no login do Deezer');
    Session.set(this.id, data.access_token, data.expires || null);
    return true;
  }

  async #call(path, method = 'GET') {
    const s = Session.get(this.id);
    if (!s) throw new Error('Sessão do Deezer expirada');
    const res = await fetch(`${BFF}/api/deezer${path}`, {
      method, headers: { 'x-deezer-token': s.token }
    });
    const data = await res.json();
    if (data.error) throw new Error(`Deezer: ${data.error.message}`);
    return data;
  }

  async findTrack(track) {
    const data = await this.#call(`/search?q=${encodeURIComponent(track.query)}&limit=1`);
    return data.data?.[0]?.id ?? null;
  }

  async createPlaylist(name, ids) {
    const pl = await this.#call(`/user/me/playlists?title=${encodeURIComponent(name)}`, 'POST');
    await this.#call(`/playlist/${pl.id}/tracks?songs=${ids.join(',')}`, 'POST');
    return { url: `https://www.deezer.com/playlist/${pl.id}` };
  }
}
