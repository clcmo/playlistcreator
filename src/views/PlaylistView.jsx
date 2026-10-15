import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faSpinner, faArrowUpRightFromSquare, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import ProviderIcon from './components/ProviderIcon.jsx';

export default function PlaylistView({ playlists, targets }) {
  const [name, setName] = useState('');
  const [list, setList] = useState('');
  const [status, setStatus] = useState('');
  const [results, setResults] = useState([]);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setResults([]);
    setResults(await playlists.generate(name, list, setStatus));
    setStatus(''); setBusy(false);
  }

  return (
    <section aria-labelledby="nova">
      <h2 id="nova">Nova playlist</h2>
      <p className="targets" aria-label="Destinos">
        {targets.map((t) => <ProviderIcon key={t.id} id={t.id} size="lg" />)}
      </p>

      <form onSubmit={submit}>
        <label>Nome da playlist
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>Músicas
          <span className="hint">Uma por linha, no formato “Artista - Música”.</span>
          <textarea rows={8} value={list} onChange={(e) => setList(e.target.value)}
                    placeholder="Daft Punk - One More Time" required />
        </label>
        <button disabled={busy}>
          <FontAwesomeIcon icon={busy ? faSpinner : faMusic} spin={busy} /> {busy ? 'Criando…' : 'Criar playlist'}
        </button>
      </form>

      {status && <p className="mono" role="status">{status}</p>}

      <ul className="results">
        {results.map((r) => (
          <li key={r.provider}>
            <ProviderIcon id={r.provider.toLowerCase()} size="lg" />
            <div>
              {r.ok ? (
                <a href={r.url} target="_blank" rel="noreferrer">
                  Abrir no {r.provider} <FontAwesomeIcon icon={faArrowUpRightFromSquare} size="sm" />
                </a>
              ) : (
                <span className="error">
                  <FontAwesomeIcon icon={faTriangleExclamation} /> {r.error}
                </span>
              )}
              {r.missing?.length > 0 && (
                <span className="mono miss">não encontradas: {r.missing.join('; ')}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
