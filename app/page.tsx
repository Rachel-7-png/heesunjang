import { HeroVisual } from '@/components/hero-visual'

export default function Home() {
  return (
    <section className="relative flex min-h-[calc(100vh-var(--header-h))] flex-col px-6 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-4 md:justify-end md:px-10 md:py-16">
      {/* Interactive light sculpture: experiences merging into one.
          The canvas layer fills the ENTIRE viewport (no fixed-height box, no
          overflow clipping) so the lights float freely across the whole screen
          instead of looking trapped inside an invisible square. */}
      <div className="pointer-events-auto fixed inset-0 z-0">
        <HeroVisual />
      </div>

      {/* Description left-aligned to the title margin (section px), pinned to the
          bottom so its bottom margin matches the header top margin. Sits above
          the light layer. Negative text-indent optically pulls the Korean ink
          flush with the title's Latin "H" (Korean glyphs carry a built-in left
          side bearing). */}
      <h1 className="relative z-10 mt-auto text-balance text-left text-[1.4rem] font-bold leading-snug tracking-tight [text-indent:-0.06em] sm:text-3xl sm:leading-[1.4] md:text-4xl md:leading-[1.4]">
        다양한 경험의 점들을 이어
        <br />
        매끄러운 사용자 경험을 만드는
        <br />
        UX/UI · 프로덕트 디자이너입니다.
      </h1>
    </section>
  )
}
