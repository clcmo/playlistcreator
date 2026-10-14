import { useEffect, useState } from 'react';
import { Wordmark, Equalizer, DotDivider } from './components/Brand.jsx';
import LoginView from './LoginView.jsx';
import PlaylistView from './PlaylistView.jsx';

export default function App({ auth, playlists }) {
  const [ready, setReady] = useState(false);
  const [, bump] = useState(0);
  const refresh = () => bump((n) => n + 1);

  useEffect(() => {
    auth.handleRedirect().catch(console.error).finally(() => setReady(true));
  }, [auth]);

  const connected = ready ? auth.connected() : [];

  return (
    <div className="shell">
      <header className="top">
        <h1><Wordmark /></h1>
        <span className="mono">criador de playlists</span>
      </header>
      <Equalizer />

      <main>
        {!ready ? (
          <p className="mono" role="status">entrando…</p>
        ) : (
          <>
            <LoginView auth={auth} onChange={refresh} />
            {connected.length > 0 && (
              <>
                <DotDivider />
                <PlaylistView playlists={playlists} targets={connected} />
              </>
            )}
          </>
        )}
      </main>

      <footer>
        <DotDivider />
        <p className="mono">v{import.meta.env.VITE_APP_VERSION || 'dev'}</p>
        <p>Criado em 19/07/2008, em Osasco-SP.</p>
      </footer>
    </div>
  );
}
