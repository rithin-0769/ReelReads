import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, TrendingUp, Film } from 'lucide-react'
import { searchMovies, hasApiKey } from '../services/tmdb'
import { TRENDING_MOVIES } from '../data/mockMovies'

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

// Local fallback: filter the trending list by title
function searchLocal(query) {
  const q = query.toLowerCase().trim()
  if (!q) return []
  return TRENDING_MOVIES.filter(m => m.title.toLowerCase().includes(q)).slice(0, 6)
}

export default function MovieSearch({ compact = false }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef()
  const navigate = useNavigate()
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      return
    }

    if (hasApiKey) {
      // Live TMDB search
      setLoading(true)
      searchMovies(debouncedQuery)
        .then(r => setResults(r.length ? r : searchLocal(debouncedQuery)))
        .catch(() => setResults(searchLocal(debouncedQuery)))
        .finally(() => setLoading(false))
    } else {
      // Always work: filter local mock list
      setResults(searchLocal(debouncedQuery))
    }
  }, [debouncedQuery])

  const handleSelect = (movie) => {
    setQuery('')
    setResults([])
    const isMock = !hasApiKey
    navigate(`/results?movieId=${movie.id}&title=${encodeURIComponent(movie.title)}${isMock ? '&mock=true' : ''}`)
  }

  const handleTrending = (movie) => {
    navigate(`/results?movieId=${movie.id}&title=${encodeURIComponent(movie.title)}&mock=true`)
  }

  const clear = () => { setQuery(''); setResults([]) }

  return (
    <div style={{ width: '100%', maxWidth: compact ? '500px' : '680px' }}>
      {/* Search Box */}
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'rgba(30, 41, 59, 0.85)',
          border: focused ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
          borderRadius: '16px',
          padding: '4px 4px 4px 20px',
          backdropFilter: 'blur(16px)',
          boxShadow: focused
            ? '0 0 0 3px rgba(99,102,241,0.2), 0 20px 40px rgba(0,0,0,0.3)'
            : '0 8px 32px rgba(0,0,0,0.3)',
          transition: 'all 0.3s ease',
        }}>
          {loading
            ? <div style={{ width: 20, height: 20, border: '2px solid var(--color-primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
            : <Search size={20} color="var(--color-muted)" style={{ flexShrink: 0 }} />
          }
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="Search a movie... (e.g. Interstellar, Inception)"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--color-text)',
              fontFamily: 'var(--font-body)',
              fontSize: compact ? '0.95rem' : '1.05rem',
              padding: '12px 0',
            }}
          />
          {query && (
            <button onClick={clear} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', padding: 8 }}>
              <X size={18} />
            </button>
          )}
          {/* Live vs Local badge */}
          <div style={{
            padding: '6px 12px',
            borderRadius: '10px',
            background: hasApiKey ? 'rgba(34,211,238,0.1)' : 'rgba(99,102,241,0.1)',
            border: `1px solid ${hasApiKey ? 'rgba(34,211,238,0.25)' : 'rgba(99,102,241,0.2)'}`,
            fontSize: '0.72rem',
            color: hasApiKey ? 'var(--color-accent)' : 'var(--color-primary-hover)',
            whiteSpace: 'nowrap',
            fontWeight: 600,
            flexShrink: 0,
          }}>
            {hasApiKey ? '🌐 Live' : '📋 Local'}
          </div>
        </div>

        {/* Search dropdown */}
        <AnimatePresence>
          {results.length > 0 && focused && (
            <motion.div
              initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
              transition={{ duration: 0.2 }}
              className="search-dropdown"
              style={{ transformOrigin: 'top' }}
            >
              {results.map(movie => (
                <div
                  key={movie.id}
                  className="dropdown-item"
                  onMouseDown={() => handleSelect(movie)}
                >
                  <div style={{
                    width: 44, height: 60, borderRadius: 8, overflow: 'hidden',
                    flexShrink: 0, background: 'var(--gradient-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {movie.posterUrl
                      ? <img src={movie.posterUrl} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <Film size={20} color="white" />
                    }
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text)' }}>{movie.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                      {movie.year}{movie.rating ? ` · ⭐ ${movie.rating}` : ''}
                      {movie.genres?.length ? ` · ${movie.genres.slice(0, 2).join(', ')}` : ''}
                    </div>
                  </div>
                </div>
              ))}
              {!hasApiKey && (
                <div style={{ padding: '10px 16px', fontSize: '0.75rem', color: 'var(--color-muted)', borderTop: '1px solid var(--color-border)' }}>
                  💡 Add a TMDB API key in <code style={{ color: 'var(--color-primary-hover)' }}>src/config.js</code> to search all movies
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No results */}
        <AnimatePresence>
          {query.trim() && !loading && results.length === 0 && focused && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="search-dropdown"
              style={{ padding: '16px 20px', textAlign: 'center' }}
            >
              <div style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>
                No results for "<strong style={{ color: 'var(--color-text)' }}>{query}</strong>"
                {!hasApiKey && (
                  <div style={{ marginTop: 6, fontSize: '0.78rem' }}>
                    Add a TMDB API key to search any movie
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Trending chips */}
      {!compact && (
        <div style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, color: 'var(--color-muted)', fontSize: '0.85rem' }}>
            <TrendingUp size={15} />
            <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trending Now</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {TRENDING_MOVIES.map(movie => (
              <motion.button
                key={movie.id}
                onClick={() => handleTrending(movie)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="chip chip-primary"
                style={{ cursor: 'pointer', border: 'none', fontFamily: 'var(--font-body)' }}
              >
                🎬 {movie.title}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
