import { Session } from '../models/Session.js';

export class AuthController {
  constructor(providers) { this.providers = providers; }

  /** Provedores com sessão ativa = os destinos disponíveis para o usuário. */
  connected() { return this.providers.filter((p) => p.isLoggedIn()); }

  login(id) {
    // GitHub Pages não tem rotas: o retorno do OAuth cai sempre na raiz do app,
    // então lembramos qual provedor iniciou o login.
    sessionStorage.setItem('pc.pending', id);
    return this.providers.find((p) => p.id === id).login();
  }
  logout(id) { Session.clear(id); }

  /** Trata o retorno do OAuth (?code=...). Retorna true se consumiu a URL. */
  async handleRedirect() {
    const params = new URLSearchParams(location.search);
    const id = sessionStorage.getItem('pc.pending');
    if (!params.has('code') || !id) return false;
    sessionStorage.removeItem('pc.pending');
    const provider = this.providers.find((p) => p.id === id);
    const ok = provider ? await provider.handleCallback(params) : false;
    history.replaceState({}, '', import.meta.env.BASE_URL);
    return ok;
  }
}
