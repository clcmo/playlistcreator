import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify, faYoutube, faDeezer } from '@fortawesome/free-brands-svg-icons';

// Cada serviço mantém a cor da própria marca para ser reconhecido de relance.
const BRAND = {
  spotify: { icon: faSpotify, color: '#1db954' },
  youtube: { icon: faYoutube, color: '#ff3333' },
  deezer: { icon: faDeezer, color: '#a238ff' }
};

export default function ProviderIcon({ id, size = '2x' }) {
  const b = BRAND[id];
  return <FontAwesomeIcon icon={b.icon} size={size} style={{ color: b.color }} fixedWidth />;
}
