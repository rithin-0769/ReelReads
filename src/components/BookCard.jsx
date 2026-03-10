import { motion } from 'framer-motion'
import { Star, BookOpen, ExternalLink } from 'lucide-react'

function StarRating({ rating }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  return (
    <span className="stars">
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(5 - full - (half ? 1 : 0))}
      <span style={{ marginLeft: 6, color: 'var(--color-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-body)' }}>
        {rating.toFixed(1)}
      </span>
    </span>
  )
}

// Gradient cover when no book image
function GradientCover({ title, index }) {
  const gradients = [
    'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    'linear-gradient(135deg, #22D3EE 0%, #6366F1 100%)',
    'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
    'linear-gradient(135deg, #10B981 0%, #22D3EE 100%)',
    'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
    'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',
    'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
    'linear-gradient(135deg, #22D3EE 0%, #10B981 100%)',
    'linear-gradient(135deg, #6366F1 0%, #22D3EE 100%)',
  ]
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: gradients[index % gradients.length],
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      gap: 12,
    }}>
      <BookOpen size={36} color="rgba(255,255,255,0.8)" />
      <div style={{
        color: 'white',
        fontSize: '0.7rem',
        fontWeight: 600,
        textAlign: 'center',
        opacity: 0.9,
        lineHeight: 1.4,
        letterSpacing: '0.03em',
      }}>
        {title?.slice(0, 30)}
      </div>
    </div>
  )
}

export default function BookCard({ book, index = 0 }) {
  return (
    <motion.div
      className="book-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -8 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Cover */}
      <div style={{
        width: '100%',
        height: 220,
        overflow: 'hidden',
        borderRadius: '14px 14px 0 0',
        position: 'relative',
        flexShrink: 0,
      }}>
        {book.cover ? (
          <img
            src={book.cover}
            alt={book.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
          />
        ) : null}
        <div style={{ width: '100%', height: '100%', display: book.cover ? 'none' : 'flex' }}>
          <GradientCover title={book.title} index={index} />
        </div>

        {/* Rating badge */}
        <div style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          borderRadius: 8,
          padding: '4px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontSize: '0.8rem',
          color: '#F59E0B',
          fontWeight: 700,
        }}>
          <Star size={12} fill="#F59E0B" />
          {book.rating?.toFixed(1)}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {/* Why Recommended chip */}
        <div className="chip chip-accent" style={{ alignSelf: 'flex-start', fontSize: '0.72rem' }}>
          ✨ {book.whyRecommended}
        </div>

        {/* Title & Author */}
        <div>
          <h3 style={{
            fontSize: '0.98rem',
            fontWeight: 700,
            color: 'var(--color-text)',
            lineHeight: 1.3,
            marginBottom: 4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {book.title}
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-muted)', fontWeight: 500 }}>
            {book.author}
          </p>
        </div>

        {/* Star rating */}
        <StarRating rating={book.rating || 4.0} />

        {/* Description */}
        {book.description && (
          <p style={{
            fontSize: '0.8rem',
            color: 'var(--color-muted)',
            lineHeight: 1.55,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {book.description}
          </p>
        )}

        {/* Footer */}
        <div style={{ marginTop: 'auto', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {book.pageCount && (
            <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
              📖 {book.pageCount} pages
            </span>
          )}
          <a
            href={book.link}
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
            style={{ padding: '8px 14px', fontSize: '0.8rem', gap: 5 }}
          >
            View Book <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </motion.div>
  )
}
