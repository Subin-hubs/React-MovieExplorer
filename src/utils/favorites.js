export function getFavorites() {
    try {
        const raw = localStorage.getItem('favorites')
        return raw ? JSON.parse(raw) : []
    } catch (e) {
        return []
    }
}

export function saveFavorites(list) {
    try {
        localStorage.setItem('favorites', JSON.stringify(list))
        // notify listeners in this window
        try { window.dispatchEvent(new CustomEvent('favoritesChanged', { detail: { count: list.length } })) } catch (e) { }
    } catch (e) { }
}

export function addFavorite(movie) {
    const list = getFavorites()
    if (!list.find((m) => m.id === movie.id)) {
        list.push(movie)
        saveFavorites(list)
    }
    return list
}

export function removeFavorite(id) {
    const list = getFavorites().filter((m) => m.id !== id)
    saveFavorites(list)
    return list
}

export function isFavorite(id) {
    return getFavorites().some((m) => m.id === id)
}
