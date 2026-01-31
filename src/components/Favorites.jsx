import React, { useEffect, useState } from 'react'
import MovieCard from './MovieCard'
import { getFavorites, removeFavorite } from '../utils/favorites'

export default function Favorites() {
  const [list, setList] = useState([])

  useEffect(() => {
    setList(getFavorites())
  }, [])

  const handleRemove = (id) => {
    setList(removeFavorite(id))
  }

  if (!list.length) return <div style={{ padding: 24 }}>No favorites yet.</div>

  return (
    <div style={{ padding: 24 }}>
      <h2>Your Favorites</h2>
      <div className="favorite-list">
        {list.map((m) => (
          <div key={m.id}>
            <MovieCard movie={m} showFav={false} />
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <button onClick={() => handleRemove(m.id)} style={{ padding: '6px 10px' }}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}