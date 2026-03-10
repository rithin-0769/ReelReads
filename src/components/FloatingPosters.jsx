import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Stars, Float } from '@react-three/drei'
import * as THREE from 'three'
import { TRENDING_MOVIES } from '../data/mockMovies'
import { TMDB_IMAGE_BASE } from '../config'

// A single floating movie poster plane
function MoviePlane({ posterUrl, position, rotation, index }) {
  const meshRef = useRef()

  // Fallback gradient texture when no poster
  const fallbackColors = [
    ['#6366F1','#8B5CF6'], ['#22D3EE','#6366F1'], ['#F59E0B','#EF4444'],
    ['#10B981','#22D3EE'], ['#EC4899','#8B5CF6'], ['#F97316','#EF4444'],
  ]
  const [c1, c2] = fallbackColors[index % fallbackColors.length]

  const fallbackTex = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 200
    canvas.height = 300
    const ctx = canvas.getContext('2d')
    const grad = ctx.createLinearGradient(0, 0, 200, 300)
    grad.addColorStop(0, c1)
    grad.addColorStop(1, c2)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 200, 300)
    // Film icon
    ctx.fillStyle = 'rgba(255,255,255,0.15)'
    ctx.beginPath()
    ctx.arc(100, 140, 40, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'
    ctx.lineWidth = 3
    ctx.stroke()
    // Title label area
    ctx.fillStyle = 'rgba(0,0,0,0.4)'
    ctx.fillRect(0, 240, 200, 60)
    const tex = new THREE.CanvasTexture(canvas)
    return tex
  }, [c1, c2])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    meshRef.current.position.y = position[1] + Math.sin(t * 0.6 + index * 1.2) * 0.25
    meshRef.current.rotation.y = rotation[1] + Math.sin(t * 0.3 + index) * 0.08
    meshRef.current.rotation.x = rotation[0] + Math.cos(t * 0.2 + index) * 0.04
  })

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} rotation={rotation} castShadow>
        <planeGeometry args={[1.4, 2.1]} />
        <meshStandardMaterial
          map={fallbackTex}
          transparent
          opacity={0.88}
          roughness={0.1}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Glow halo */}
      <mesh position={position} rotation={rotation}>
        <planeGeometry args={[1.55, 2.25]} />
        <meshBasicMaterial
          color={c1}
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  )
}

// Poster arrangement
const POSTER_LAYOUT = [
  { position: [-5.5, 0.5, -3], rotation: [0, 0.35, 0], index: 0 },
  { position: [-3.5, -0.8, -2], rotation: [0, 0.25, 0.03], index: 1 },
  { position: [-1.8, 0.8, -1.5], rotation: [0, 0.1, -0.02], index: 2 },
  { position: [5.5, 0.5, -3], rotation: [0, -0.35, 0], index: 3 },
  { position: [3.5, -0.8, -2], rotation: [0, -0.25, -0.03], index: 4 },
  { position: [1.8, 0.8, -1.5], rotation: [0, -0.1, 0.02], index: 5 },
]

export default function FloatingPosters() {
  const movies = TRENDING_MOVIES.slice(0, 6)

  return (
    <Canvas
      className="hero-canvas"
      camera={{ position: [0, 0, 6], fov: 60 }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#818CF8" />
      <pointLight position={[-5, 3, 2]} intensity={0.8} color="#22D3EE" />
      <pointLight position={[5, -3, 2]} intensity={0.6} color="#6366F1" />

      <Stars
        radius={80}
        depth={50}
        count={3000}
        factor={3}
        saturation={0.8}
        fade
        speed={0.5}
      />

      {POSTER_LAYOUT.map((layout, i) => (
        <MoviePlane
          key={i}
          posterUrl={movies[i]?.posterUrl}
          position={layout.position}
          rotation={layout.rotation}
          index={layout.index}
        />
      ))}
    </Canvas>
  )
}
