import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { ThemeProvider } from './components/ThemeProvider';
import './index.css';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

// No forced theme class; respect user's OS or site theme toggle

root.render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
