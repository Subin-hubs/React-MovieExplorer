// src/utils/sessionManager.js

const SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const SESSION_KEY = 'userSessionExpiry';

export const setSessionExpiry = () => {
    const expiryTime = Date.now() + SESSION_DURATION;
    localStorage.setItem(SESSION_KEY, expiryTime.toString());
};

export const isSessionValid = () => {
    const expiryTime = localStorage.getItem(SESSION_KEY);
    if (!expiryTime) return false;

    const currentTime = Date.now();
    return currentTime < parseInt(expiryTime);
};

export const clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
};

export const getRemainingTime = () => {
    const expiryTime = localStorage.getItem(SESSION_KEY);
    if (!expiryTime) return 0;

    const remaining = parseInt(expiryTime) - Date.now();
    return remaining > 0 ? remaining : 0;
};