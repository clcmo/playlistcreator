/** Guarda tokens por provedor (SSO). Troque por armazenamento seguro no app nativo. */
const KEY = 'pc.sessions';
export const Session = {
  all() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } },
  get(id) {
    const s = this.all()[id];
    return s && (!s.expiresAt || s.expiresAt > Date.now()) ? s : null;
  },
  set(id, token, expiresInSec) {
    const all = this.all();
    all[id] = { token, expiresAt: expiresInSec ? Date.now() + expiresInSec * 1000 - 30000 : null };
    localStorage.setItem(KEY, JSON.stringify(all));
  },
  clear(id) { const all = this.all(); delete all[id]; localStorage.setItem(KEY, JSON.stringify(all)); }
};
