import { Provider } from './Provider.js';
import { Session } from '../models/Session.js';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API = 'https://www.googleapis.com/youtube/v3';

export class YouTubeProvider extends Provider {
  id = 'youtube';
  label = 'YouTube';

  isLoggedIn() { return !!Session.get(this.id); }

  // Google Identity Services (popup, sem redirecionamento).
  login() {
    return new Promise((resolve, reject) => {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/youtube',
        callback: (r) => {
          if (r.error) return reject(new Error(r.error));
          Session.set(this.id, r.access_token, Number(r.expires_in));
          resolve();
        }
      });
      client.requestAccessToken();
    });
  }

  async #call(path, init = {}) {
    const s = Session.get(this.id);
    if (!s) throw new Error('Sessão do YouTube expirada');
    const res = await fetch(`${API}${path}`, {
      ...init,
      headers: { Authorization: `Bearer ${s.token}`, 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error(`YouTube ${res.status}`);
    return res.json();
  }

  // Atenção: search.list custa 100 unidades de cota; cada insert custa 50.
  async findTrack(track) {
    const q = encodeURIComponent(track.query);
    const data = await this.#call(`/search?part=snippet&type=video&maxResults=1&q=${q}`);
    return data.items?.[0]?.id?.videoId ?? null;
  }

  async createPlaylist(name, videoIds) {
    const pl = await this.#call('/playlists?part=snippet,status', {
      method: 'POST',
      body: JSON.stringify({ snippet: { title: name }, status: { privacyStatus: 'private' } })
    });
    for (const videoId of videoIds) {
      await this.#call('/playlistItems?part=snippet', {
        method: 'POST',
        body: JSON.stringify({ snippet: { playlistId: pl.id, resourceId: { kind: 'youtube#video', videoId } } })
      });
    }
    return { url: `https://www.youtube.com/playlist?list=${pl.id}` };
  }
}
