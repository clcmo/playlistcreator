import { Track } from '../models/Track.js';

export class PlaylistController {
  constructor(auth) { this.auth = auth; }

  /**
   * Resolve as faixas em cada provedor conectado e cria a playlist.
   * Um provedor falhar não derruba os outros.
   * @returns {Promise<Array<{provider:string, ok:boolean, url?:string, missing?:string[], error?:string}>>}
   */
  async generate(name, rawList, onProgress = () => {}) {
    const tracks = Track.parseList(rawList);
    const results = [];
    for (const p of this.auth.connected()) {
      try {
        onProgress(`${p.label}: buscando faixas…`);
        const ids = [];
        const missing = [];
        for (const t of tracks) {
          const id = await p.findTrack(t);
          id ? ids.push(id) : missing.push(t.query);
        }
        onProgress(`${p.label}: criando playlist…`);
        const { url } = await p.createPlaylist(name, ids);
        results.push({ provider: p.label, ok: true, url, missing });
      } catch (e) {
        results.push({ provider: p.label, ok: false, error: e.message });
      }
    }
    return results;
  }
}
