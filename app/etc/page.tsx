'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Globe, List, X } from 'lucide-react'

const SECTIONS = ['PHOTO', 'MUSIC'] as const
type Section = (typeof SECTIONS)[number]

type Photo = { url: string; location: string; date: string }

const photoData: Photo[] = [
  { url: 'https://i.ibb.co/MDckfRxS/IMG-5242.jpg', location: 'House of Parliament', date: '2026.04.26' },
  { url: 'https://i.ibb.co/gMy5ghCn/IMG-4755.jpg', location: 'Budapest-Felhévíz', date: '2026.04.25' },
  { url: 'https://i.ibb.co/3YdHWH9Z/IMG-4814.jpg', location: 'Müpa Budapest', date: '2026.04.25' },
  { url: 'https://i.ibb.co/mCYjrf8d/IMG-4031.jpg', location: 'Citadella', date: '2026.04.24' },
  {
    url: 'https://i.ibb.co/LXTmYqH5/IMG-2630.jpg',
    location: 'Memorial to the Murdered Jews of Europe',
    date: '2026.04.22',
  },
  { url: 'https://i.ibb.co/hTvvKJ0/IMG-2108.jpg', location: 'Berlin Pariser Platz', date: '2026.04.21' },
  { url: 'https://i.ibb.co/7dz2LN34/IMG-2047.jpg', location: 'Lustgarten', date: '2026.04.21' },
  { url: 'https://i.ibb.co/0Rh6CYj4/IMG-2114.jpg', location: 'Berlin Pariser Platz', date: '2026.04.21' },
  { url: 'https://i.ibb.co/jkJHwGVk/IMG-0398.jpg', location: 'Asamkirche', date: '2026.04.18' },
  { url: 'https://i.ibb.co/Y4Wm4sj1/IMG-0679.jpg', location: 'Englischer Garten', date: '2026.04.18' },
  { url: 'https://i.ibb.co/20ZN0NcJ/IMG-0644.jpg', location: 'Englischer Garten', date: '2026.04.18' },
  { url: 'https://i.ibb.co/d0GW99gd/IMG-9767.jpg', location: 'Hallstatt', date: '2026.04.17' },
  { url: 'https://i.ibb.co/bjZGFY1h/IMG-9768.jpg', location: 'Hallstatt', date: '2026.04.17' },
  { url: 'https://i.ibb.co/YBmQ1cM0/IMG-9140.jpg', location: 'Innsbruck', date: '2026.04.16' },
  { url: 'https://i.ibb.co/S7n1Ddr9/IMG-9157.jpg', location: 'Innsbruck', date: '2026.04.16' },
  { url: 'https://i.ibb.co/chKQwvnp/IMG-9174.jpg', location: 'Innsbruck', date: '2026.04.16' },
  { url: 'https://i.ibb.co/Q3h8t4RY/IMG-9362.jpg', location: 'Alps', date: '2026.04.16' },
  { url: 'https://i.ibb.co/q388dxyb/IMG-7920.jpg', location: 'Sisi Museum Hofburg Wien', date: '2026.04.14' },
  { url: 'https://i.ibb.co/Wv8fwLSr/IMG-7196.jpg', location: 'Wien', date: '2026.04.13' },
  { url: 'https://i.ibb.co/FqNknrbN/IMG-6591.jpg', location: 'Schloss Belvedere', date: '2026.04.12' },
  { url: 'https://i.ibb.co/S4DqY2XJ/IMG-6718.jpg', location: 'Burggarten', date: '2026.04.12' },
  { url: 'https://i.ibb.co/kVgMsrsb/IMG-5129.jpg', location: 'Florence - Centro Storico', date: '2026.04.07' },
  { url: 'https://i.ibb.co/SpP56sv/IMG-4278.jpg', location: 'Piazza della Repubblica', date: '2026.04.06' },
  { url: 'https://i.ibb.co/gMm5W9cL/IMG-3760.jpg', location: 'Positano', date: '2026.04.05' },
  { url: 'https://i.ibb.co/NggrTQny/IMG-3866.jpg', location: 'Furore', date: '2026.04.05' },
  { url: 'https://i.ibb.co/6RXG1wJq/IMG-2934.jpg', location: 'Roma', date: '2026.04.04' },
  { url: 'https://i.ibb.co/DHZtqFPW/IMG-9154.jpg', location: 'Roma', date: '2026.04.04' },
  { url: 'https://i.ibb.co/s94qJN0H/IMG-0940.jpg', location: "Fisherman's Bastion", date: '2026.03.30' },
  {
    url: 'https://i.ibb.co/Z1gXwbqT/IMG-0166.jpg',
    location: 'Budapest-Belső-Ferencváros',
    date: '2026.03.26',
  },
  { url: 'https://i.ibb.co/nNBfzr3j/IMG-9142.jpg', location: 'Szechenyi Thermal Bath', date: '2026.03.24' },
  { url: 'https://i.ibb.co/sv1W0BXZ/IMG-7786.jpg', location: 'Dongbuk Gongsimdon', date: '2025.10.08' },
  { url: 'https://i.ibb.co/Ld6bJBy0/IMG-7806.jpg', location: 'Banghwasuryujeong', date: '2025.10.08' },
  { url: 'https://i.ibb.co/4wdhvMd5/IMG-1841.jpg', location: 'Sokcho', date: '2025.07.06' },
  { url: 'https://i.ibb.co/5gdX3zGQ/IMG-0106.jpg', location: 'Wonju', date: '2024.10.24' },
  { url: 'https://i.ibb.co/Xx9tgfrF/IMG-6597.jpg', location: 'Yanghwa Hangang Park', date: '2024.08.31' },
]

// Sort by date DESCENDING (newest first) before rendering any view.
const PHOTOS: Photo[] = [...photoData].sort((a, b) => b.date.localeCompare(a.date))

function EtcContent() {
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab')
  const [active, setActive] = useState<Section>('PHOTO')

  // Section can be chosen from the mobile menu via ?tab=.
  useEffect(() => {
    if (tab === 'music') setActive('MUSIC')
    else if (tab === 'photo' || tab === 'photography') setActive('PHOTO')
  }, [tab])

  return (
    <section className="relative min-h-[calc(100vh-var(--header-h))] overflow-x-clip px-6 pb-24 pt-24 md:px-10 md:pt-28">
      <div className="mx-auto w-full max-w-6xl">
        {/* Category navigation — horizontal + centered on desktop, hidden on mobile. */}
        <nav className="mb-10 hidden items-center justify-center gap-8 md:flex md:gap-12">
          {SECTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setActive(s)}
              className={`text-base font-bold tracking-wide transition-opacity ${
                active === s ? 'opacity-100' : 'opacity-30 hover:opacity-100'
              }`}
            >
              {s}
            </button>
          ))}
        </nav>

        {/* Content area. */}
        <div className="min-w-0">
          {active === 'PHOTO' && <PhotographySection />}
          {active === 'MUSIC' && <MusicSection />}
        </div>
      </div>
    </section>
  )
}

export default function EtcPage() {
  return (
    <Suspense fallback={null}>
      <EtcContent />
    </Suspense>
  )
}

type PhotoView = 'SPHERE' | 'LIST'

function PhotographySection() {
  const [view, setView] = useState<PhotoView>('SPHERE')

  return (
    <div>
      {/* View toggle — icons only, aligned RIGHT. Inverted colors; ~2/3 height. */}
      <div className="flex justify-end">
        <div className="inline-flex items-center gap-1 rounded-full border border-foreground bg-foreground p-0.5">
          <button
            type="button"
            onClick={() => setView('SPHERE')}
            aria-label="Sphere view"
            aria-pressed={view === 'SPHERE'}
            className={`inline-flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
              view === 'SPHERE' ? 'bg-background text-foreground' : 'text-background'
            }`}
          >
            <Globe size={14} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => setView('LIST')}
            aria-label="List view"
            aria-pressed={view === 'LIST'}
            className={`inline-flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
              view === 'LIST' ? 'bg-background text-foreground' : 'text-background'
            }`}
          >
            <List size={14} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className="mt-6">
        {view === 'SPHERE' ? <Sphere3D /> : <ListView />}
      </div>
    </div>
  )
}

// True 3D photo sphere using CSS 3D transforms (perspective + preserve-3d).
// Tiles are placed on an actual spherical surface via X/Y/Z coordinates; the
// sphere auto-rotates slowly and responds to the pointer. Nearer tiles render
// larger through perspective. Click a tile to view it clearly.
function Sphere3D() {
  const innerRef = useRef<HTMLDivElement>(null)
  const rot = useRef({ x: -8, y: 0 })
  const target = useRef({ x: -8, y: 0 })
  const dragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })
  const moved = useRef(false)
  const [selected, setSelected] = useState<number | null>(null)

  // Distribute tiles evenly over a sphere (fibonacci) and orient each outward.
  // One tile per photograph so the whole (date-sorted) set is represented.
  const COUNT = PHOTOS.length
  const golden = Math.PI * (3 - Math.sqrt(5))
  const tiles = Array.from({ length: COUNT }).map((_, i) => {
    const y = 1 - (i / (COUNT - 1)) * 2 // 1 -> -1
    const r = Math.sqrt(1 - y * y)
    const phi = golden * i
    const x = Math.cos(phi) * r
    const z = Math.sin(phi) * r
    const rotY = (Math.atan2(x, z) * 180) / Math.PI
    const rotX = (Math.asin(y) * -180) / Math.PI
    return { rotX, rotY, photo: i }
  })

  useEffect(() => {
    let raf = 0
    let auto = 0
    // Pause the slow spin while a photo is open or while the user is dragging.
    const paused = () => selected !== null || dragging.current
    const tick = () => {
      // Continuous slow auto-rotation to the right.
      if (!paused()) auto += 0.1
      rot.current.x += (target.current.x - rot.current.x) * 0.08
      rot.current.y += (target.current.y - rot.current.y) * 0.08
      if (innerRef.current) {
        innerRef.current.style.transform = `translateZ(-1px) rotateX(${rot.current.x}deg) rotateY(${
          rot.current.y + auto
        }deg)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [selected])

  // Click-and-drag (mouse) / swipe (touch) to rotate the sphere manually.
  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true
    moved.current = false
    last.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    const dx = e.clientX - last.current.x
    const dy = e.clientY - last.current.y
    if (Math.abs(dx) + Math.abs(dy) > 3) moved.current = true
    last.current = { x: e.clientX, y: e.clientY }
    target.current.y += dx * 0.35
    // Clamp vertical tilt so the sphere never flips upside down.
    target.current.x = Math.max(-80, Math.min(80, target.current.x - dy * 0.35))
  }

  const onPointerUp = (e: React.PointerEvent) => {
    dragging.current = false
    e.currentTarget.releasePointerCapture?.(e.pointerId)
  }

  // Photos are offset by half their size so they stay centered. The overall
  // radius is kept moderate (NOT enlarged) so the sphere fits safely inside its
  // container; the individual tiles are made SMALLER to open up wide gaps
  // between the photos instead of growing the sphere.
  const [radius, setRadius] = useState(150)
  const [tileSize, setTileSize] = useState(44)
  useEffect(() => {
    const update = () => {
      const desktop = window.matchMedia('(min-width: 768px)').matches
      setRadius(desktop ? 240 : 150)
      setTileSize(desktop ? 66 : 44)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  const half = tileSize / 2

  return (
    <div className="relative mt-10 md:mt-20">
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="mx-auto flex h-[400px] w-full cursor-grab touch-none items-center justify-center active:cursor-grabbing md:h-[560px]"
        style={{ perspective: '1200px' }}
      >
        <div
          ref={innerRef}
          className="relative"
          style={{ transformStyle: 'preserve-3d', width: 1, height: 1 }}
        >
          {tiles.map((t, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                // Ignore the click that ends a drag/swipe gesture.
                if (moved.current) return
                setSelected(t.photo)
              }}
              className="absolute overflow-hidden border border-border bg-background/90 transition-colors hover:border-foreground"
              style={{
                width: tileSize,
                height: tileSize,
                left: -half,
                top: -half,
                transform: `rotateY(${t.rotY}deg) rotateX(${t.rotX}deg) translateZ(${radius}px)`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PHOTOS[t.photo].url || '/placeholder.svg'}
                alt={PHOTOS[t.photo].location}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Selected photo lightbox. */}
      {selected !== null && (
        <div
          className="fixed inset-0 top-[var(--header-h)] z-40 flex items-center justify-center bg-background/95 px-6"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            aria-label="Close"
            className="absolute right-6 top-6 inline-flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-60"
          >
            <X size={24} strokeWidth={1.75} />
          </button>
          <div className="flex w-full max-w-4xl flex-col items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PHOTOS[selected].url || '/placeholder.svg'}
              alt={PHOTOS[selected].location}
              loading="lazy"
              decoding="async"
              className="max-h-[75vh] w-auto max-w-full object-contain"
            />
            <div className="flex w-full items-baseline justify-between">
              <span className="text-sm font-bold tracking-wide">{PHOTOS[selected].location}</span>
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {PHOTOS[selected].date}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// List view.
// Desktop: list occupies the LEFT half; hovering a row previews its photo in the
//   RIGHT half, dims all non-hovered rows to light gray, and clicking expands the
//   right-side image to full screen (scaling from right to left).
// Mobile: rows open inline to reveal the photograph (single-column, no split).
function ListView() {
  const [hovered, setHovered] = useState<number | null>(null)
  const [fullscreen, setFullscreen] = useState<number | null>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  // Track which images have finished downloading so the right-side container can
  // show a minimal loading state until the current preview is ready.
  const [loaded, setLoaded] = useState<Record<number, boolean>>({})
  const markLoaded = (i: number) => setLoaded((p) => (p[i] ? p : { ...p, [i]: true }))

  const preview = hovered ?? 0
  const previewReady = loaded[preview]

  return (
    <>
      {/* Silent background preload: eagerly fetch the first 5 images, lazy-load
          the rest so hovers feel instant without blocking initial render. */}
      <div aria-hidden="true" className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0">
        {PHOTOS.map((photo, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={photo.url || '/placeholder.svg'}
            alt=""
            fetchPriority={i < 5 ? 'high' : 'low'}
            loading={i < 5 ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => markLoaded(i)}
          />
        ))}
      </div>

      <div className="flex gap-0 md:gap-10">
        {/* LEFT: list — full width on mobile, 50% on desktop.
            Border logic: when a row is hovered, ONLY the border directly above
            and directly below it stay black; every other divider (including the
            list's top border) turns light gray. With nothing hovered, all black. */}
        <ul
          className={`w-full border-t transition-colors duration-300 md:w-1/2 ${
            hovered === null || hovered === 0 ? 'border-foreground' : 'border-gray-300'
          }`}
        >
          {PHOTOS.map((photo, i) => {
            // This row's BOTTOM border is black only if it borders the hovered row
            // (i.e. it is the hovered row itself, or the row just above it).
            const borderBlack =
              hovered === null || i === hovered || i === hovered - 1
            // Text: black for the hovered row (or when nothing is hovered),
            // light gray for every other row.
            const textBlack = hovered === null || i === hovered
            return (
              <li
                key={i}
                onMouseEnter={() => setHovered(i)}
                className={`border-b transition-colors duration-300 ${
                  borderBlack ? 'border-foreground' : 'border-gray-300'
                } ${textBlack ? 'text-foreground' : 'text-gray-300'}`}
              >
                <button
                  type="button"
                  onClick={() => {
                    // Desktop: expand the previewed image to full screen.
                    // Mobile: toggle the inline photo open/closed.
                    if (window.matchMedia('(min-width: 768px)').matches) {
                      setFullscreen(i)
                    } else {
                      setOpenIndex(openIndex === i ? null : i)
                    }
                  }}
                  aria-expanded={openIndex === i}
                  className="flex w-full items-baseline justify-between py-4 text-left md:py-5"
                >
                  <span className="text-base font-bold tracking-wide md:text-lg">
                    {photo.location}
                  </span>
                  <span className="text-base font-bold tracking-wide md:text-lg">
                    {photo.date}
                  </span>
                </button>

                {/* Mobile-only inline photo. */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-out md:hidden ${
                    openIndex === i ? 'max-h-[520px] pb-6 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url || '/placeholder.svg'}
                    alt={photo.location}
                    loading="lazy"
                    decoding="async"
                    className="max-h-[75vh] w-full object-contain"
                  />
                </div>
              </li>
            )
          })}
        </ul>

        {/* RIGHT: hovered preview (desktop only). */}
        <div
          className="sticky top-28 hidden h-[75vh] flex-1 items-center justify-center md:flex"
          onMouseLeave={() => setHovered(null)}
        >
          {hovered !== null && (
            <button
              type="button"
              onClick={() => setFullscreen(preview)}
              className="relative flex h-full w-full items-center justify-center"
              aria-label={`Expand ${PHOTOS[preview].location}`}
            >
              {/* Minimal loading state — shown only while this image downloads. */}
              {!previewReady && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-foreground" />
                </span>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PHOTOS[preview].url || '/placeholder.svg'}
                alt={PHOTOS[preview].location}
                loading="lazy"
                decoding="async"
                onLoad={() => markLoaded(preview)}
                className={`max-h-full w-auto max-w-full object-contain transition-opacity duration-300 ${
                  previewReady ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </button>
          )}
        </div>
      </div>

      {/* Fullscreen expansion (desktop click) — scales up from right to left. */}
      {fullscreen !== null && (
        <div
          className="fixed inset-0 top-[var(--header-h)] z-40 flex origin-right animate-[photoExpand_0.5s_ease-out] items-center justify-center bg-background/95 px-6"
          role="dialog"
          aria-modal="true"
          onClick={() => setFullscreen(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PHOTOS[fullscreen].url || '/placeholder.svg'}
            alt={PHOTOS[fullscreen].location}
            loading="lazy"
            decoding="async"
            className="max-h-[85vh] w-auto max-w-full object-contain"
          />
        </div>
      )}
    </>
  )
}

const MUSIC_VIDEOS = [
  {
    url: 'https://youtu.be/RqGKpLlbmm8',
    thumb: 'https://img.youtube.com/vi/RqGKpLlbmm8/maxresdefault.jpg',
  },
  {
    url: 'https://youtu.be/ugn1dcY_fqQ',
    thumb: 'https://img.youtube.com/vi/ugn1dcY_fqQ/maxresdefault.jpg',
  },
]

function MusicSection() {
  return (
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {MUSIC_VIDEOS.map((video, i) => (
        <a
          key={i}
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block aspect-video overflow-hidden border border-border transition-colors hover:border-foreground"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={video.thumb || '/placeholder.svg'}
            alt={`Music video ${i + 1}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </a>
      ))}
    </div>
  )
}


