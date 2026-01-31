import React, { createContext, useContext, useState } from 'react'

const ToastContext = createContext(null)

export function useToast() {
    return useContext(ToastContext)
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const showToast = (message, duration = 2200) => {
        const id = Date.now() + Math.random()
        setToasts((t) => [...t, { id, message }])
        setTimeout(() => {
            setToasts((t) => t.filter((x) => x.id !== id))
        }, duration)
    }

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="toast-container">
                {toasts.map((t) => (
                    <div key={t.id} className="toast">{t.message}</div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}
