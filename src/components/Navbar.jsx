// src/components/Navbar.jsx
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
import { getFavorites } from '../utils/favorites'
import HeartIcon from '../assets/heart.svg'
import AuthModal from './AuthModal'
import { auth } from '../config/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { isSessionValid, clearSession, setSessionExpiry } from '../utils/sessionManager'

export default function Navbar() {
    const [count, setCount] = useState(0)
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [user, setUser] = useState(null)
    const [showDropdown, setShowDropdown] = useState(false)

    useEffect(() => {
        setCount(getFavorites().length)
        const handler = (e) => {
            setCount(e?.detail?.count ?? getFavorites().length)
        }
        window.addEventListener('favoritesChanged', handler)
        return () => window.removeEventListener('favoritesChanged', handler)
    }, [])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log('Auth state changed:', currentUser) // Debug log

            if (currentUser) {
                // Check if session is still valid
                if (isSessionValid()) {
                    console.log('Session is valid, setting user') // Debug log
                    setUser(currentUser)
                } else {
                    // Check if there's a session expiry set, if not, set it (for existing sessions)
                    const sessionExpiry = localStorage.getItem('userSessionExpiry')
                    if (!sessionExpiry) {
                        console.log('No session expiry found, setting new one') // Debug log
                        setSessionExpiry()
                        setUser(currentUser)
                    } else {
                        // Session expired, log out user
                        console.log('Session expired') // Debug log
                        handleLogout()
                    }
                }
            } else {
                console.log('No user, clearing session') // Debug log
                setUser(null)
                clearSession()
            }
        })
        return () => unsubscribe()
    }, [])

    // Check session validity every minute
    useEffect(() => {
        const interval = setInterval(() => {
            if (user && !isSessionValid()) {
                handleLogout()
                alert('Your session has expired. Please login again.')
            }
        }, 60000) // Check every minute

        return () => clearInterval(interval)
    }, [user])

    const handleLogout = async () => {
        try {
            await signOut(auth)
            clearSession()
            setShowDropdown(false)
            setUser(null) // Explicitly set user to null
        } catch (err) {
            console.error('Logout error:', err)
        }
    }

    // Get user initials for avatar
    const getUserInitials = () => {
        if (user?.displayName) {
            return user.displayName.charAt(0).toUpperCase()
        }
        if (user?.email) {
            return user.email.charAt(0).toUpperCase()
        }
        return 'U'
    }

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
                    {user ? (
                        <div className="profile-container">
                            <div
                                className="profile-icon"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="Profile" className="profile-image" />
                                ) : (
                                    <div className="profile-initial">{getUserInitials()}</div>
                                )}
                            </div>

                            {showDropdown && (
                                <div className="profile-dropdown">
                                    <div className="dropdown-header">
                                        <p className="user-name">{user.displayName || user.email}</p>
                                        <p className="user-email">{user.email}</p>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    <button className="dropdown-item" onClick={() => {
                                        setShowDropdown(false)
                                        // Navigate to profile page if you have one
                                    }}>
                                        Profile
                                    </button>
                                    <button className="dropdown-item" onClick={() => {
                                        setShowDropdown(false)
                                        // Navigate to settings page if you have one
                                    }}>
                                        Settings
                                    </button>
                                    <div className="dropdown-divider"></div>
                                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button className="login-btn" onClick={() => setIsAuthModalOpen(true)}>
                            Login
                        </button>
                    )}
                </div>
            </nav>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />

            {/* Close dropdown when clicking outside */}
            {showDropdown && (
                <div
                    className="dropdown-overlay"
                    onClick={() => setShowDropdown(false)}
                ></div>
            )}
        </>
    )
}