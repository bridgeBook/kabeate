import React, { useState, useEffect } from 'react';
import Game from './game/Game';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(mq.matches);

    const handler = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    mq.addEventListener('change', handler);

    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div>
      <button onClick={() => setDarkMode(prev => !prev)}>
        {darkMode ? 'ライトモードに切替' : 'ダークモードに切替'}
      </button>
      <Game darkMode={darkMode} />
    </div>
  );
};

export default App;
