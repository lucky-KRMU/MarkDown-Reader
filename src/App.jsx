import { useState, useEffect } from 'react'
import Header from './Components/Header'
import MainBody from './Components/Main/MainBody'

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('md-reader-theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('md-reader-theme', theme);
  }, [theme]);

  return (
    <div className={`theme-${theme} w-full min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 flex flex-col`}>
      <Header />
      <MainBody theme={theme} setTheme={setTheme} />
    </div>
  )
}

export default App
