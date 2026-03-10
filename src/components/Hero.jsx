import { useRef, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ArrowDown } from 'lucide-react'
import FloatingPosters from './FloatingPosters'
import MovieSearch from './MovieSearch'

const TEXT_VARIANTS = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.4, 0, 0.2, 1] },
  }),
}

export default function Hero() {
  const searchRef = useRef()

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      padding: '120px 24px 60px',
      background: 'var(--gradient-hero)',
    }}>
      {/* Radial glow blobs */}
      <div style={{
        position: 'absolute', top: '20%', left: '15%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
        filter: 'blur(20px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '40%', right: '10%',
        width: 350, height: 350, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)',
        filter: 'blur(20px)', pointerEvents: 'none',
      }} />

      {/* 3D Canvas overlay */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Suspense fallback={null}>
          <FloatingPosters />
        </Suspense>
      </div>

      {/* Dots pattern */}
      <div className="dots-pattern" style={{
        position: 'absolute', inset: 0,
        opacity: 0.4, pointerEvents: 'none',
      }} />

      {/* Hero content */}
      <div style={{
        position: 'relative', zIndex: 10,
        textAlign: 'center',
        maxWidth: 760,
        width: '100%',
      }}>
        {/* Badge */}
        <motion.div
          custom={0} variants={TEXT_VARIANTS} initial="hidden" animate="visible"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24 }}
        >
          <div className="chip chip-accent" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
            <Sparkles size={13} /> AI-Powered Book Discovery
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          custom={1} variants={TEXT_VARIANTS} initial="hidden" animate="visible"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.2rem, 6vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: 20,
            color: 'var(--color-text)',
            letterSpacing: '-1px',
          }}
        >
          Turn Movies You Love Into
          <br />
          <span className="gradient-text">Books You'll Adore</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          custom={2} variants={TEXT_VARIANTS} initial="hidden" animate="visible"
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--color-muted)',
            marginBottom: 48,
            lineHeight: 1.7,
            maxWidth: 540,
            margin: '0 auto 48px',
          }}
        >
          Search any movie and we'll instantly recommend books with the same themes,
          tone, and storytelling style — so you'll always know what to read next.
        </motion.p>

        {/* Search */}
        <motion.div
          custom={3} variants={TEXT_VARIANTS} initial="hidden" animate="visible"
          ref={searchRef}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <MovieSearch />
        </motion.div>

        {/* Stats row */}
        <motion.div
          custom={4} variants={TEXT_VARIANTS} initial="hidden" animate="visible"
          style={{
            display: 'flex', justifyContent: 'center', gap: 40,
            marginTop: 56,
            flexWrap: 'wrap',
          }}
        >
          {[
            { label: 'Movies Analyzed', value: '50,000+' },
            { label: 'Books Recommended', value: '1M+' },
            { label: 'Readers Happy', value: '10K+' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>{stat.value}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', marginTop: 2, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        style={{
          position: 'absolute', bottom: 32,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          color: 'var(--color-muted)', fontSize: '0.75rem',
          animation: 'float 3s ease-in-out infinite',
        }}
      >
        <span>Scroll to explore</span>
        <ArrowDown size={16} />
      </motion.div>
    </section>
  )
}
