import React from 'react'
import './Home.css'
import { Link } from 'react-router-dom'
import cameraImage from '../assets/camera.jpg'

export default function Home() {
    return (
        <div className="home-container">
            <div className="banner">
                <div className="banner-left">
                    <h1 className="banner-title">Movie Explorer</h1>
                    <p className="banner-subtitle">Discover and browse the latest movies, read details, and save your favorites.</p>
                    <div className="banner-buttons">
                        <Link to="/movies" className="banner-button play-btn">Browse movies</Link>
                    </div>
                </div>
                <div className="banner-right">
                    <img src={cameraImage} alt="Camera" className="banner-image" />
                </div>
            </div>
        </div>
    )
}
