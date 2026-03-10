import { Suspense } from 'react'
import Hero from '../components/Hero'
import { motion } from 'framer-motion'
import { Film, BookOpen, Zap } from 'lucide-react'

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: Film,
    title: 'Pick a Movie',
    desc: 'Search any film or select from our trending list. From blockbusters to cult classics.',
    color: '#6366F1',
  },
  {
    step: '02',
    icon: Zap,
    title: 'We Analyze It',
    desc: 'Our engine extracts genre, themes, tone, and storytelling style from the movie.',
    color: '#22D3EE',
  },
  {
    step: '03',
    icon: BookOpen,
    title: 'Get Book Recs',
    desc: 'Receive curated book recommendations that match the vibe of the film you loved.',
    color: '#8B5CF6',
  },
]

export default function Home() {
  return (
    <main>
      <Hero />

      {/* How It Works Section */}
      <section style={{
        padding: '100px 24px',
        maxWidth: 1100,
        margin: '0 auto',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <div className="chip chip-accent" style={{ marginBottom: 16, display: 'inline-flex', fontSize: '0.8rem' }}>
            ✨ Dead Simple
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800,
            color: 'var(--color-text)',
            letterSpacing: '-0.5px',
          }}>
            How It <span className="gradient-text">Works</span>
          </h2>
          <p style={{ color: 'var(--color-muted)', marginTop: 12, maxWidth: 480, margin: '12px auto 0', lineHeight: 1.7 }}>
            Three simple steps to discover your next favorite book based on a movie you already love.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 28,
        }}>
          {HOW_IT_WORKS.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.step}
                className="glass"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ y: -5 }}
                style={{ padding: '36px 32px', position: 'relative', overflow: 'hidden' }}
              >
                {/* Step number watermark */}
                <div style={{
                  position: 'absolute', top: -10, right: 16,
                  fontSize: '5rem', fontWeight: 900, color: step.color,
                  opacity: 0.06, lineHeight: 1, fontFamily: 'var(--font-display)',
                }}>
                  {step.step}
                </div>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: `${step.color}22`,
                  border: `1px solid ${step.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20,
                }}>
                  <Icon size={24} color={step.color} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 10 }}>
                  {step.title}
                </h3>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', lineHeight: 1.65 }}>
                  {step.desc}
                </p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* CTA Banner */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{
          margin: '0 24px 80px',
          maxWidth: 900,
          marginLeft: 'auto',
          marginRight: 'auto',
          borderRadius: 24,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(34,211,238,0.1) 100%)',
          border: '1px solid rgba(99,102,241,0.25)',
          padding: '60px 40px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', top: -60, left: -60,
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: -40, right: -40,
          width: 180, height: 180, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)',
        }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            fontWeight: 800,
            color: 'var(--color-text)',
            marginBottom: 12,
          }}>
            Ready to Build Your Reading List?
          </h2>
          <p style={{ color: 'var(--color-muted)', marginBottom: 28, fontSize: '1rem', lineHeight: 1.7 }}>
            Join thousands of movie lovers who've found their next favorite book through ReelReads.
          </p>
          <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="btn-primary">
            🎬 Find My Books
          </a>
        </div>
      </motion.section>
    </main>
  )
}
