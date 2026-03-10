import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import RecommendationGrid from '../components/RecommendationGrid'
import MovieSearch from '../components/MovieSearch'
import { getMovieDetails } from '../services/tmdb'
import { getBookRecommendations } from '../services/books'
import { TRENDING_MOVIES } from '../data/mockMovies'

export default function Results() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const movieId = searchParams.get('movieId')
  const movieTitle = searchParams.get('title')
  const useMock = searchParams.get('mock') === 'true'

  const [movie, setMovie] = useState(null)
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!movieId) {
      navigate('/')
      return
    }

    setLoading(true)
    setError(null)
    setBooks([])
    setMovie(null)

    async function load() {
      try {
        let movieData = null

        // Try live TMDB first
        if (!useMock) {
          movieData = await getMovieDetails(movieId)
        }

        // Fall back to mock data
        if (!movieData) {
          movieData = TRENDING_MOVIES.find(m => m.id === parseInt(movieId, 10)) ?? {
            id: parseInt(movieId, 10),
            title: movieTitle ?? 'Unknown Movie',
            genre_ids: [878],
            genres: ['Sci-Fi'],
            themes: ['science', 'adventure'],
          }
        }

        setMovie(movieData)

        const booksData = await getBookRecommendations(movieData)
        setBooks(booksData)
      } catch (err) {
        console.error(err)
        setError('Could not load recommendations. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [movieId, useMock])

  return (
    <main style={{ paddingTop: 80 }}>
      {/* Top bar */}
      <div style={{
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--color-border)',
        padding: '20px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
        position: 'sticky',
        top: 72,
        zIndex: 50,
        backdropFilter: 'blur(20px)',
      }}>
        <button
          className="btn-ghost"
          onClick={() => navigate('/')}
          style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', gap: 6, alignItems: 'center' }}
        >
          <ArrowLeft size={15} /> Back
        </button>

        <div style={{ flex: 1, maxWidth: 480 }}>
          <MovieSearch compact />
        </div>
      </div>

      {/* Hero strip for Results */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(34,211,238,0.08) 100%)',
        borderBottom: '1px solid var(--color-border)',
        padding: '32px 28px',
        textAlign: 'center',
      }}>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: 6 }}
        >
          Reading recommendations for
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 800,
            color: 'var(--color-text)',
          }}
        >
          {movieTitle ?? movie?.title ?? '...'}
        </motion.h1>
      </div>

      {/* Grid */}
      <div style={{ marginTop: 40 }}>
        <RecommendationGrid
          books={books}
          movie={movie}
          loading={loading}
          error={error}
        />
      </div>
    </main>
  )
}
