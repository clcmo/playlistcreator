/** Contrato comum. Cada serviço implementa estes quatro métodos. */
export class Provider {
  id = '';
  label = '';
  isLoggedIn() { throw new Error('não implementado'); }
  login() { throw new Error('não implementado'); }
  /** Volta do redirecionamento OAuth. Retorna true se tratou o callback. */
  async handleCallback(_params) { return false; }
  /** @returns {Promise<string|null>} id/uri da faixa no serviço */
  async findTrack(_track) { throw new Error('não implementado'); }
  /** @returns {Promise<{url:string}>} */
  async createPlaylist(_name, _trackIds) { throw new Error('não implementado'); }
}
