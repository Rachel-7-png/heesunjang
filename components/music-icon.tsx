'use client'

import { useEffect, useRef, useState } from 'react'
import { MUSIC_SRC } from '@/lib/music'

// Classic equalizer bars. Each bar has a distinct resting height and, while
// playing, its own keyframe/duration/delay so the wave feels organic.
const BARS = [
  { rest: 40, anim: 'eqbar1', dur: '1s', delay: '0s' },
  { rest: 70, anim: 'eqbar2', dur: '0.8s', delay: '0.15s' },
  { rest: 100, anim: 'eqbar3', dur: '1.1s', delay: '0.05s' },
  { rest: 60, anim: 'eqbar2', dur: '0.9s', delay: '0.25s' },
  { rest: 45, anim: 'eqbar1', dur: '1.05s', delay: '0.1s' },
]

/**
 * Classic equalizer sound control.
 * - Paused: static, minimal vertical bars at their resting heights.
 * - Playing: the bars animate up and down smoothly like a sound wave.
 * - Real <audio> with preload="auto" so playback starts instantly (no lag).
 */
export function MusicIcon({ className }: { className?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onPause)
    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onPause)
    }
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) void audio.play().catch(() => {})
    else audio.pause()
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? 'Pause music' : 'Play music'}
      className={`inline-flex h-9 w-9 items-center justify-center text-foreground transition-opacity hover:opacity-60 ${className ?? ''}`}
    >
      <span
        aria-hidden="true"
        className="flex h-[18px] items-end justify-center gap-[3px]"
      >
        {BARS.map((bar, i) => (
          <span
            key={i}
            className="w-[2px] rounded-full bg-current"
            style={
              playing
                ? {
                    animationName: bar.anim,
                    animationDuration: bar.dur,
                    animationDelay: bar.delay,
                    animationTimingFunction: 'ease-in-out',
                    animationIterationCount: 'infinite',
                    height: `${bar.rest}%`,
                  }
                : { height: `${bar.rest}%`, opacity: 0.7 }
            }
          />
        ))}
      </span>
      <audio ref={audioRef} src={MUSIC_SRC} loop preload="auto" />
    </button>
  )
}
