import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
import { getFavorites } from '../utils/favorites'
import HeartIcon from '../assets/heart.svg'


export default function Navbar() {
    const [count, setCount] = useState(0)

    useEffect(() => {
        setCount(getFavorites().length)
        const handler = (e) => {
            setCount(e?.detail?.count ?? getFavorites().length)
        }
        window.addEventListener('favoritesChanged', handler)
        return () => window.removeEventListener('favoritesChanged', handler)
    }, [])

    return (
        <>
            <nav className="navbar">
                <h2 className="logo"><Link to="/">Kathmandu Hub</Link></h2>
                <div className="center-links">
                    <Link to="/">Home</Link>
                    <Link to="/movies">Movies</Link>
                </div>
                <div className="right-links">
                    <Link to="/favorites" className="cart-icon-wrapper">
                        <img src={HeartIcon} alt="favorites" className="cart-icon" />
                        <span className="cart-badge">{count}</span>
                    </Link>
                </div>
            </nav>

        </>
    )
}
