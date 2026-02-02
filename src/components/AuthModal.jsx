// src/components/AuthModal.jsx
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import './AuthModal.css'
import { auth, googleProvider, db } from '../config/firebase'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { setSessionExpiry } from '../utils/sessionManager'

export default function AuthModal({ isOpen, onClose }) {
    const [isLogin, setIsLogin] = useState(true)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, formState: { errors }, reset } = useForm()

    // Function to create user document in Firestore
    const createUserDocument = async (user) => {
        if (!user) return

        const userRef = doc(db, 'users', user.uid)
        const userSnap = await getDoc(userRef)

        // Only create document if it doesn't exist
        if (!userSnap.exists()) {
            const { email, displayName, photoURL } = user

            try {
                await setDoc(userRef, {
                    email,
                    displayName: displayName || email.split('@')[0],
                    photoURL: photoURL || null,
                    createdAt: serverTimestamp(),
                    lastLogin: serverTimestamp()
                })
                console.log('User document created successfully')
            } catch (error) {
                console.error('Error creating user document:', error)
            }
        } else {
            // Update last login time
            await setDoc(userRef, {
                lastLogin: serverTimestamp()
            }, { merge: true })
        }
    }

    const onSubmit = async (data) => {
        setError('')
        setLoading(true)

        try {
            let userCredential

            if (isLogin) {
                // Login
                userCredential = await signInWithEmailAndPassword(auth, data.email, data.password)
            } else {
                // Signup
                userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
            }

            // Create or update user document in Firestore
            await createUserDocument(userCredential.user)

            // Set session expiry (2 hours)
            setSessionExpiry()

            reset()
            onClose()
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setError('')
        setLoading(true)

        try {
            const result = await signInWithPopup(auth, googleProvider)

            // Create or update user document in Firestore
            await createUserDocument(result.user)

            // Set session expiry (2 hours)
            setSessionExpiry()

            onClose()
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const toggleMode = () => {
        setIsLogin(!isLogin)
        setError('')
        reset()
    }

    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>

                <h2 className="modal-title">{isLogin ? 'Login' : 'Sign Up'}</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                }
                            })}
                            placeholder="Enter your email"
                        />
                        {errors.email && <span className="error-text">{errors.email.message}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters'
                                }
                            })}
                            placeholder="Enter your password"
                        />
                        {errors.password && <span className="error-text">{errors.password.message}</span>}
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
                    </button>
                </form>

                <div className="divider">
                    <span>OR</span>
                </div>

                <button className="google-btn" onClick={handleGoogleLogin} disabled={loading}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                        <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853" />
                        <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                        <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                </button>

                <div className="toggle-mode">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button type="button" onClick={toggleMode} className="toggle-btn">
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </div>
            </div>
        </div>
    )
}