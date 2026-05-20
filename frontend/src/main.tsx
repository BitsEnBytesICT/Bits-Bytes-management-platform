import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import MainBody from './components/layout/mainBody/mainBody'
import Navbar from './components/layout/navbar/navbar'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Navbar />
    <BrowserRouter>
      {/* Navigation */}
      {/* <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav> */}
      <Routes>
        <Route path="/" element={<MainBody />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)