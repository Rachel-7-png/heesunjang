'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MusicIcon } from '@/components/music-icon'

const NAV = [
  { label: 'ABOUT', href: '/about' },
  { label: 'PROJECT', href: '/project' },
  { label: 'ETC', href: '/etc' },
  { label: 'CONTACT', href: '/contact' },
]

// Mobile Etc submenu — sections chosen from inside the menu.
const ETC_TABS = [
  { label: 'Photo', href: '/etc?tab=photo' },
  { label: 'Music', href: '/etc?tab=music' },
  { label: 'Film', href: '/etc?tab=film' },
]

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [etcOpen, setEtcOpen] = useState(false)
  const isAbout = pathname === '/about'
  const isHome = pathname === '/'

  // Close the mobile overlay whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Reset the Etc submenu when the overlay closes.
  useEffect(() => {
    if (!open) setEtcOpen(false)
  }, [open])

  // Prevent background scroll while the overlay is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const isActive = (href: string) => pathname === href

  // Only the font SIZE changes between states; the top-left origin stays fixed
  // (constant padding below), so the About title expands rightward and downward
  // from the same anchor rather than shifting.
  const titleFont = isAbout
    ? 'text-6xl lg:text-7xl'
    : isHome
      ? 'text-5xl sm:text-xl'
      : 'text-lg sm:text-xl'

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full bg-transparent">
      {/* Top bar: explicit black text so the title, nav, and hamburger are
          ALWAYS visible on both web and mobile. Raised above the mobile overlay
          so the morphing hamburger stays visible and clickable. */}
      <div className="relative z-50 flex items-start justify-between px-6 md:px-10 h-[var(--header-h)] text-foreground">
        {/* Title — hidden on mobile while the menu is open. */}
        <Link
          href="/"
          aria-label="Heesun Jang — home"
          className={`pt-7 font-bold leading-[0.85] tracking-tight transition-all duration-500 ${titleFont} ${
            open ? 'pointer-events-none opacity-0 md:pointer-events-auto md:opacity-100' : ''
          }`}
        >
          Heesun
          <br />
          Jang
        </Link>

        <div className="flex items-center gap-6 pt-6">
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-bold tracking-wide transition-opacity hover:opacity-60 ${
                  isActive(item.href) ? 'border-b border-foreground pb-0.5' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
            <MusicIcon />
          </nav>

          {/* Mobile controls — the hamburger stays mounted and morphs to an X. */}
          <div className="flex md:hidden items-center gap-3">
            {!open && <MusicIcon />}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close navigation' : 'Open navigation'}
              aria-expanded={open}
              className="relative inline-flex h-9 w-9 items-center justify-center"
            >
              {/* Three lines that rotate/cross into an X when open. */}
              <span
                className={`absolute left-1/2 h-[2px] w-6 -translate-x-1/2 bg-current transition-all duration-300 ease-in-out ${
                  open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-[13px]'
                }`}
              />
              <span
                className={`absolute left-1/2 top-1/2 h-[2px] w-6 -translate-x-1/2 -translate-y-1/2 bg-current transition-all duration-200 ease-in-out ${
                  open ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute left-1/2 h-[2px] w-6 -translate-x-1/2 bg-current transition-all duration-300 ease-in-out ${
                  open ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'top-[23px]'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay navigation — solid WHITE background, BLACK text.
          Blend reset to normal so it renders opaque white. */}
      <div
        className={`fixed inset-0 z-40 overflow-y-auto bg-white text-black [mix-blend-mode:normal] transition-opacity duration-300 md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <nav className="flex flex-col gap-6 px-6 pb-16 pt-[calc(var(--header-h)+3.5rem)]">
          <Link
            href="/"
            className={`text-5xl font-medium tracking-tight ${
              isActive('/') ? 'underline underline-offset-8' : ''
            }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`text-5xl font-medium tracking-tight ${
              isActive('/about') ? 'underline underline-offset-8' : ''
            }`}
          >
            About
          </Link>
          <Link
            href="/project"
            className={`text-5xl font-medium tracking-tight ${
              isActive('/project') ? 'underline underline-offset-8' : ''
            }`}
          >
            Project
          </Link>

          {/* Etc — expands to its sections in-place. */}
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => setEtcOpen((v) => !v)}
              aria-expanded={etcOpen}
              className={`text-left text-5xl font-medium tracking-tight ${
                pathname === '/etc' ? 'underline underline-offset-8' : ''
              }`}
            >
              Etc
            </button>
            {etcOpen && (
              <div className="flex flex-col gap-3 pl-4">
                {ETC_TABS.map((tab) => (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className="text-2xl font-normal tracking-tight text-black/60"
                  >
                    {tab.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/contact"
            className={`text-5xl font-medium tracking-tight ${
              isActive('/contact') ? 'underline underline-offset-8' : ''
            }`}
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  )
}
