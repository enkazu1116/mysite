import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Header from './components/header'
import Content from './components/content'
import Skills from './features/Skills/skills'
import { BrowserRouter, Routes, Route } from 'react-router'

if (import.meta.env.DEV) {
  const { worker } = await import ('./features/Skills/api/mock/browser');
  await worker.start();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Content />} />
        <Route path="/skills" element={<Skills />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
