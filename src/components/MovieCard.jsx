import React from 'react'
import { Link } from 'react-router-dom'
import './Movies.css'
import { addFavorite, isFavorite } from '../utils/favorites'
import { useToast } from './Toast'

export default function MovieCard({ movie, disableLink = false, showFav = true }) {
    const IMG_BASE = 'https://image.tmdb.org/t/p/w500'
    const { showToast } = useToast()

    const handleFav = (e) => {
        e.preventDefault()
        e.stopPropagation()
        addFavorite(movie)
        showToast('Added to favorites')
    }

    const content = (
        <div className="movie-card">
            {showFav && (
                <button className="fav-btn" onClick={handleFav} aria-label="Add to favorites">
                    <span className="heart">{isFavorite(movie.id) ? '♥' : '♡'}</span>
                </button>
            )}
            <img
                className="movie-poster"
                src={movie.poster_path ? IMG_BASE + movie.poster_path : ''}
                alt={movie.title}
            />
            <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <div className="movie-meta">
                    <span className="movie-date">{movie.release_date}</span>
                    <span className="movie-score">⭐ {movie.vote_average}</span>
                </div>
                <p className="card-overview">{movie.overview}</p>
            </div>
        </div>
    )

    if (disableLink) return content

    return (
        <Link to={`/movies/${movie.id}`} state={{ movie }} className="movie-link">
            {content}
        </Link>
    )
}
