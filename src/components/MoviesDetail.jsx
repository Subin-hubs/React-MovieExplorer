import React, { useState } from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import './MoviesDetail.css'
import { addFavorite, isFavorite } from '../utils/favorites'
import { useToast } from './Toast'

export default function MoviesDetail() {
  const { id } = useParams()
  const location = useLocation()
  const movie = location.state?.movie || null
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleFav = () => {
    if (!movie) return
    addFavorite(movie)
    showToast('Added to favorites')
    navigate('/favorites')
  }

  if (!movie) {
    return (
      <div className="detail-page">
        <div className="detail-empty">
          <h2>Movie Not Found</h2>
          <p>Navigate from the movie list to see full details.</p>
          <button onClick={() => navigate('/')} className="back-button">
            Back to Movies
          </button>
        </div>
      </div>
    )
  }

  const IMG = 'https://image.tmdb.org/t/p/w500'
  const BACKDROP = 'https://image.tmdb.org/t/p/original'
  const posterUrl = movie.poster_path ? IMG + movie.poster_path : ''
  const backdropUrl = movie.backdrop_path ? BACKDROP + movie.backdrop_path : ''

  return (
    <div className="detail-page">
      <div className="detail-hero">
        <div
          className="detail-backdrop"
          style={{ backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none' }}
        >
          <div className="backdrop-overlay"></div>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-wrapper">
          <div className="poster-container">
            <img
              className={`detail-poster ${imageLoaded ? 'loaded' : ''}`}
              src={posterUrl}
              alt={movie.title}
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          <div className="info-section">
            <div className="title-group">
              <h1 className="detail-title">{movie.title}</h1>
              {movie.original_title !== movie.title && (
                <p className="original-title">{movie.original_title}</p>
              )}
            </div>

            <div className="meta-pills">
              <span className="pill year-pill">
                {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
              </span>
              <span className="pill rating-pill">
                <span className="star">★</span>
                {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
              </span>
              <span className="pill language-pill">
                {movie.original_language?.toUpperCase()}
              </span>
            </div>

            <div className="overview-section">
              <h3 className="section-heading">Synopsis</h3>
              <p className="detail-overview">
                {movie.overview || 'No overview available.'}
              </p>
            </div>

            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Popularity</span>
                <span className="stat-value">{movie.popularity?.toFixed(0)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Votes</span>
                <span className="stat-value">{movie.vote_count?.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Release Date</span>
                <span className="stat-value">
                  {movie.release_date ? new Date(movie.release_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  }) : 'N/A'}
                </span>
              </div>
            </div>

            <div className="action-buttons">
              <button
                className={`fav-button ${isFavorite(movie.id) ? 'is-favorite' : ''}`}
                onClick={handleFav}
              >
                <span className="button-icon">
                  {isFavorite(movie.id) ? '♥' : '♡'}
                </span>
                <span className="button-text">
                  {isFavorite(movie.id) ? 'In Favorites' : 'Add to Favorites'}
                </span>
              </button>

              <button className="back-button" onClick={() => navigate(-1)}>
                ← Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}