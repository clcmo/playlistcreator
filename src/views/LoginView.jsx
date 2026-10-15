import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import ProviderIcon from './components/ProviderIcon.jsx';

export default function LoginView({ auth, onChange }) {
  const [error, setError] = useState('');

  async function login(p) {
    setError('');
    try { await auth.login(p.id); onChange(); }
    catch (e) { setError(`Não foi possível entrar no ${p.label}: ${e.message}`); }
  }

  return (
    <section aria-labelledby="contas">
      <h2 id="contas">Contas</h2>
      <p className="hint">A playlist é criada em todos os serviços conectados.</p>
      <ul className="providers">
        {auth.providers.map((p) => {
          const on = p.isLoggedIn();
          return (
            <li key={p.id} className="prov" data-on={on}>
              <ProviderIcon id={p.id} />
              <div className="prov-name">
                <strong>{p.label}</strong>
                <span className="mono">{on ? 'conectado' : 'desconectado'}</span>
              </div>
              {on ? (
                <button className="ghost" onClick={() => { auth.logout(p.id); onChange(); }}>
                  <FontAwesomeIcon icon={faRightFromBracket} /> Sair
                </button>
              ) : (
                <button onClick={() => login(p)}>
                  <FontAwesomeIcon icon={faRightToBracket} /> Entrar
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {error && <p className="error" role="alert">{error}</p>}
    </section>
  );
}
