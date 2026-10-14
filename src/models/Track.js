/** Faixa pedida pelo usuário, ainda não resolvida em nenhum provedor. */
export class Track {
  constructor(artist, title) {
    this.artist = artist;
    this.title = title;
  }
  get query() { return `${this.artist} ${this.title}`.trim(); }

  /** Converte linhas "Artista - Música" em Tracks. */
  static parseList(text) {
    return text
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const [artist, ...rest] = l.split(' - ');
        return rest.length ? new Track(artist.trim(), rest.join(' - ').trim()) : new Track('', l);
      });
  }
}
