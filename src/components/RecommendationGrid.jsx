import { motion } from 'framer-motion'
import BookCard from './BookCard'
import { Film, BookOpen, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function RecommendationGrid({ books, movie, loading, error }) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          border: '3px solid rgba(99,102,241,0.2)',
          borderTopColor: 'var(--color-primary)',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 24px',
        }} />
        <p style={{ color: 'var(--color-muted)', fontSize: '1rem' }}>
          Analyzing <strong style={{ color: 'var(--color-text)' }}>{movie?.title}</strong> and finding your perfect books...
        </p>
        {/* Skeleton cards */}
        <div style={{
          marginTop: 40,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 24,
          maxWidth: 1100,
          margin: '40px auto 0',
          padding: '0 24px',
        }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass" style={{ height: 380, overflow: 'hidden' }}>
              <div className="skeleton" style={{ height: 220 }} />
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="skeleton" style={{ height: 20, width: '75%' }} />
                <div className="skeleton" style={{ height: 14, width: '50%' }} />
                <div className="skeleton" style={{ height: 12, width: '60%' }} />
                <div className="skeleton" style={{ height: 50, width: '100%' }} />
              </div>
            </div>
          ))}
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>⚠️</div>
        <h3 style={{ color: 'var(--color-text)', marginBottom: 8 }}>Something went wrong</h3>
        <p style={{ color: 'var(--color-muted)', marginBottom: 24 }}>{error}</p>
        <button className="btn-primary" onClick={() => navigate('/')}>Try Again</button>
      </div>
    )
  }

  if (!books || books.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
      style={{ padding: '0 24px 80px', maxWidth: 1200, margin: '0 auto' }}
    >
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BookOpen size={18} color="white" />
          </div>
          <span className="chip chip-accent" style={{ fontSize: '0.8rem' }}>
            {books.length} Books Found
          </span>
        </div>

        <h2 style={{
          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          fontWeight: 800,
          color: 'var(--color-text)',
          marginBottom: 8,
          fontFamily: 'var(--font-display)',
        }}>
          Because you liked{' '}
          <span className="gradient-text">
            {movie?.title ?? 'this movie'}
          </span>
        </h2>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem' }}>
          Recommendations based on{' '}
          {movie?.genres?.join(', ') ?? movie?.genre_ids?.slice(0, 2).join(', ') ?? 'similar themes and tone'}
        </p>
      </div>

      {/* Movie info banner */}
      {movie && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass"
          style={{
            display: 'flex', gap: 20, padding: '20px 24px',
            marginBottom: 40, alignItems: 'center', flexWrap: 'wrap',
          }}
        >
          {movie.posterUrl && (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              style={{ width: 56, height: 80, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
            />
          )}
          {!movie.posterUrl && (
            <div style={{ width: 56, height: 80, borderRadius: 8, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Film size={24} color="white" />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>{movie.title}</h3>
              {movie.year && <span style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>{movie.year}</span>}
              {movie.rating && (
                <span style={{ color: '#F59E0B', fontSize: '0.85rem', fontWeight: 600 }}>⭐ {movie.rating}</span>
              )}
            </div>
            {movie.overview && (
              <p style={{
                color: 'var(--color-muted)', fontSize: '0.82rem', lineHeight: 1.6,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {movie.overview}
              </p>
            )}
            {movie.genres && (
              <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                {movie.genres.slice(0, 4).map(g => (
                  <span key={g} className="chip chip-primary" style={{ fontSize: '0.72rem', padding: '3px 10px' }}>{g}</span>
                ))}
              </div>
            )}
          </div>
          <button className="btn-ghost" onClick={() => navigate('/')} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <RefreshCw size={14} /> New Search
          </button>
        </motion.div>
      )}

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 24,
      }}>
        {books.map((book, i) => (
          <BookCard key={book.id ?? i} book={book} index={i} />
        ))}
      </div>
    </motion.div>
  )
}
