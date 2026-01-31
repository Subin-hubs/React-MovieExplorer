import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home.jsx'
import Movies from './components/Movies.jsx'
import MoviesDetail from './components/MoviesDetail.jsx'
import Favorites from './components/Favorites.jsx'
import Navbar from './components/Navbar.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/movies/:id" element={<MoviesDetail />} />
      <Route path="/favorites" element={<Favorites />} />
    </Routes>
    
    </>
  )
}

export default App
