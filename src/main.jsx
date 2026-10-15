import React from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { SpotifyProvider } from './providers/SpotifyProvider.js';
import { YouTubeProvider } from './providers/YouTubeProvider.js';
import { DeezerProvider } from './providers/DeezerProvider.js';
import { AuthController } from './controllers/AuthController.js';
import { PlaylistController } from './controllers/PlaylistController.js';
import App from './views/App.jsx';
import './views/styles.css';

registerSW({ immediate: true });

// Composição: o único lugar que conhece as classes concretas.
const auth = new AuthController([new SpotifyProvider(), new YouTubeProvider(), new DeezerProvider()]);
const playlists = new PlaylistController(auth);

createRoot(document.getElementById('root')).render(<App auth={auth} playlists={playlists} />);
