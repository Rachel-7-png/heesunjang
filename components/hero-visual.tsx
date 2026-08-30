'use client'

import { useEffect, useRef } from 'react'

/**
 * Abstract, light-based hero visual.
 *
 * Concept: "different experiences gradually connect and become a new experience."
 * A few large, soft, weightless points of light drift through white space. They
 * ease toward the cursor, gently attract one another, and their light blends
 * where they overlap. One brighter light is the "new experience" — interacting
 * pulls the others into it until they merge into a single, calmer, unified glow.
 *
 * Rendered on a transparent 2D canvas (no visible box, no border, no 3D objects,
 * no glass, no network/graph). Soft radial gradients + multiply blending.
 */

type Light = {
  // Home position as a fraction of the min dimension, relative to center.
  hx: number
  hy: number
  // Live position (px, relative to center).
  x: number
  y: number
  // Slow-wander parameters.
  ax: number
  ay: number
  fx: number
  fy: number
  phx: number
  phy: number
  radius: number // fraction of min dimension
  color: [number, number, number]
  alpha: number
  special?: boolean
}

// Soft, restrained tints designed to read as light (not objects) on white.
// Home positions are spread wider (toward the edges) and the wander amplitudes
// are larger so the lights drift across a more spacious area instead of
// clustering in the center.
const LIGHTS: Light[] = [
  { hx: -0.46, hy: -0.18, x: 0, y: 0, ax: 0.13, ay: 0.11, fx: 0.11, fy: 0.09, phx: 0.0, phy: 1.1, radius: 0.24, color: [233, 189, 186], alpha: 0.5 },
  { hx: 0.44, hy: -0.3, x: 0, y: 0, ax: 0.14, ay: 0.1, fx: 0.09, fy: 0.12, phx: 2.0, phy: 0.4, radius: 0.26, color: [188, 203, 233], alpha: 0.5 },
  { hx: -0.36, hy: 0.32, x: 0, y: 0, ax: 0.13, ay: 0.1, fx: 0.13, fy: 0.08, phx: 4.2, phy: 2.7, radius: 0.22, color: [236, 223, 189], alpha: 0.48 },
  { hx: 0.34, hy: 0.3, x: 0, y: 0, ax: 0.14, ay: 0.11, fx: 0.08, fy: 0.11, phx: 5.5, phy: 3.9, radius: 0.21, color: [210, 197, 230], alpha: 0.46 },
  // The "new experience" — brighter, warmer, a touch larger and more distinct.
  { hx: 0.02, hy: -0.02, x: 0, y: 0, ax: 0.09, ay: 0.08, fx: 0.07, fy: 0.06, phx: 1.4, phy: 4.8, radius: 0.3, color: [248, 236, 214], alpha: 0.62, special: true },
]

export function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointer = useRef({ x: 0, y: 0, active: false })
  const merged = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches

    let width = 0
    let height = 0
    let dpr = 1
    let raf = 0
    let start = performance.now()
    let mergeAmt = 0

    // Working copies of live positions.
    const state = LIGHTS.map((l) => ({ ...l }))

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
    }

    const minDim = () => Math.min(width, height)

    const draw = (now: number) => {
      const t = (now - start) / 1000
      const cx = width / 2
      const cy = height / 2
      const md = minDim()

      // Ease the merge amount toward its target.
      const mTarget = merged.current ? 1 : 0
      mergeAmt += (mTarget - mergeAmt) * 0.035
      const m = mergeAmt

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'multiply'

      // Special light live position (target for merging).
      const special = state.find((s) => s.special)!
      const sx = cx + special.x
      const sy = cy + special.y

      // Autonomous "virtual cursor" on touch devices for a subtle living feel.
      let px = pointer.current.x
      let py = pointer.current.y
      let pActive = pointer.current.active
      if (coarse && !pActive && !reduce) {
        px = cx + Math.cos(t * 0.35) * md * 0.22
        py = cy + Math.sin(t * 0.47) * md * 0.16
        pActive = true
      }

      for (const s of state) {
        // Base home position + slow organic wander.
        const wander = reduce
          ? { x: 0, y: 0 }
          : {
              x: Math.sin(t * s.fx * Math.PI * 2 + s.phx) * s.ax * md,
              y: Math.cos(t * s.fy * Math.PI * 2 + s.phy) * s.ay * md,
            }
        let tx = s.hx * md + wander.x
        let ty = s.hy * md + wander.y

        // Gentle mutual attraction (lights drift toward the group's heart).
        tx *= 1 - m * 0.15
        ty *= 1 - m * 0.15

        // Cursor attraction when apart.
        if (pActive && m < 0.6 && !s.special) {
          const gx = cx + s.x
          const gy = cy + s.y
          const dx = px - gx
          const dy = py - gy
          const dist = Math.hypot(dx, dy)
          const influence = md * 0.5
          if (dist < influence) {
            const pull = (1 - dist / influence) ** 2 * 0.4
            tx += dx * pull
            ty += dy * pull
          }
        }

        // Merge: non-special lights flow into the special one.
        if (!s.special && m > 0.001) {
          tx = tx * (1 - m) + (sx - cx) * m
          ty = ty * (1 - m) + (sy - cy) * m
        }

        // Ease live position.
        s.x += (tx - s.x) * (reduce ? 1 : 0.05)
        s.y += (ty - s.y) * (reduce ? 1 : 0.05)

        // Radius + alpha respond to merge and cursor proximity.
        let radius = s.radius * md
        let alpha = s.alpha
        if (s.special) {
          radius *= 1 + m * 0.85 + (reduce ? 0 : Math.sin(t * 1.1) * 0.03)
          alpha *= 1 + m * 0.22
        } else {
          radius *= 1 - m * 0.5
          alpha *= 1 - m // fades as it merges into the unified light
          if (pActive && m < 0.6) {
            const gx = cx + s.x
            const gy = cy + s.y
            const dist = Math.hypot(px - gx, py - gy)
            const influence = md * 0.5
            if (dist < influence) {
              const near = (1 - dist / influence) ** 2
              radius *= 1 + near * 0.12
              alpha *= 1 + near * 0.25
            }
          }
        }

        if (alpha <= 0.004 || radius <= 0) continue

        const gx = cx + s.x
        const gy = cy + s.y
        const [r, g, b] = s.color
        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, radius)
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${Math.min(0.85, alpha)})`)
        grad.addColorStop(0.55, `rgba(${r}, ${g}, ${b}, ${Math.min(0.85, alpha) * 0.4})`)
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(gx, gy, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalCompositeOperation = 'source-over'

      if (!reduce) raf = requestAnimationFrame(draw)
    }

    resize()
    const ro = new ResizeObserver(() => {
      resize()
      if (reduce) {
        start = performance.now()
        draw(start)
      }
    })
    ro.observe(canvas)

    start = performance.now()
    if (reduce) draw(start)
    else raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  const onPointerMove = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    pointer.current.x = e.clientX - rect.left
    pointer.current.y = e.clientY - rect.top
    pointer.current.active = true
  }

  const onPointerLeave = () => {
    pointer.current.active = false
  }

  const onClick = () => {
    merged.current = !merged.current
  }

  return (
    <div
      className="relative h-full w-full cursor-pointer select-none"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onClick={onClick}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
