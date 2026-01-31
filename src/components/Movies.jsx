import React, { useState, useEffect } from 'react'
import MovieCard from './MovieCard'
import './Movies.css'

export default function Movies() {
  const [moviesData, setMoviesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://api.themoviedb.org/3/discover/movie?api_key=80d491707d8cf7b38aa19c7ccab0952f')
        if (!response.ok) {
          throw new Error('Failed to fetch movies')
        }
        const data = await response.json()
        setMoviesData(data.results || [])
        setError(null)
      } catch (err) {
        setError(err.message)
        setMoviesData([])
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  if (loading) {
    return <div className="movie-list"><p>Loading movies...</p></div>
  }

  if (error) {
    return <div className="movie-list"><p>Error: {error}</p></div>
  }

  return (
    <div className="movie-list">
      {moviesData.map((m) => (
        <MovieCard key={m.id} movie={m} />
      ))}
    </div>
  )
}
