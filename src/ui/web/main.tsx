import { createRoot } from 'react-dom/client';
import { GameApp } from './GameApp';
import './styles.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(<GameApp />);