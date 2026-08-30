'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Custom circular cursor that inverts the colors beneath it.
 * - Follows the pointer via a ref (no per-frame React re-render).
 * - `mix-blend-mode: difference` + white background = black/white inversion.
 * - `pointer-events-none` so it never blocks interaction.
 * - Desktop only: hidden on touch/coarse pointers, where the default cursor
 *   (and native cursor hiding) doesn't apply.
 */
export function InvertCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // Only enable for devices with a fine pointer (mouse/trackpad).
    const mql = window.matchMedia('(pointer: fine)')
    const apply = () => setEnabled(mql.matches)
    apply()
    mql.addEventListener('change', apply)
    return () => mql.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const dot = dotRef.current
    if (!dot) return

    const move = (e: PointerEvent) => {
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
      if (dot.style.opacity !== '1') dot.style.opacity = '1'
    }
    const hide = () => {
      dot.style.opacity = '0'
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerdown', move)
    document.addEventListener('mouseleave', hide)

    // Hide the native cursor while this is active.
    document.documentElement.classList.add('invert-cursor-active')

    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', move)
      document.removeEventListener('mouseleave', hide)
      document.documentElement.classList.remove('invert-cursor-active')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] h-6 w-6 rounded-full opacity-0"
      style={{
        backgroundColor: '#ffffff',
        mixBlendMode: 'difference',
        willChange: 'transform',
      }}
    />
  )
}
