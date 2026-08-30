// Each entry is one paragraph; inner strings are individual lines (line breaks).
const PARAGRAPHS: string[][] = [
  ['안녕하세요.'],
  [
    '디지털 콘텐츠와 VR/AR 개발을 전공했지만,',
    '제가 가장 오래 관심을 가져온 것은 음악과 영화였습니다.',
  ],
  ['공연을 기획하고 무대에 오르고,'],
  ['영화제에서 관객들이 온전히 작품을 즐길 수 있도록 돕기도 했습니다.'],
  [
    '한때는 진로로 고민했을 만큼, 누군가에게 새롭고 즐거운 경험을 전하고',
    '그 경험에 몰입하게 만드는 일 자체가 좋았습니다.',
  ],
  ['비록 전공을 진로로 삼을 만큼의 큰 흥미를 느끼진 못했지만,'],
  ['한 가지 중요한 사실을 깨달았습니다.'],
  [
    '기술이 아무리 화려하고 뛰어나도, 그것을 처음 접하는 사람들에게',
    '낯설고 불편하다면 아무런 의미가 없다는 것을요.',
  ],
  ['돌이켜보면 제가 항상 즐거움을 느꼈던 곳은 늘 경험이 사람에게 전달되는 최전선이었습니다.'],
  ['이러한 생각은 저를 자연스럽게 UX/UI의 세계로 이끌었습니다.'],
  ['제가 체득한 관찰과 공감의 감각을', '이제는 디지털 화면 위로 가져오려 합니다.'],
  [
    '사용자가 낯선 인터페이스 앞에서 길을 잃지 않고 목적지까지 편안하게 다다를 수 있도록,',
    '따뜻한 시선과 타당한 논리로 프로덕트를 만드는 디자이너가 되겠습니다.',
  ],
]

export default function AboutPage() {
  return (
    // Top padding clears the enlarged header title (rendered in the global header).
    <section className="px-6 pb-24 pt-28 sm:pt-40 md:px-10 lg:min-h-screen lg:pt-72">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Portrait — appears first on mobile, anchored bottom-right on desktop. */}
        <div className="order-1 lg:order-2 lg:col-span-4 lg:col-start-9 lg:self-end">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://i.ibb.co/zWv933H3/IMG-0224.jpg"
            alt="Portrait of Heesun Jang"
            className="mx-auto aspect-[3/4] w-full max-w-xs object-cover sm:max-w-sm lg:max-w-none"
          />
        </div>

        {/* Intro copy + contact footer.
            The left edge is aligned to start just after the letter "n" in the
            header title "Heesun" (title: left:40px, 72px font → "Heesun" ends
            near x≈299px). A fixed left padding on large screens places the text
            one space past that x-coordinate, clear of the portrait column. */}
        <div className="order-2 lg:order-1 lg:col-span-8 lg:col-start-1 lg:pl-[272px]">
          <div className="flex max-w-2xl flex-col gap-6 text-[0.8125rem] font-medium leading-relaxed text-black md:text-[0.9375rem]">
            {PARAGRAPHS.map((para, i) => (
              <p key={i}>
                {para.map((line, j) => (
                  <span key={j} className="block">
                    {line}
                  </span>
                ))}
              </p>
            ))}
          </div>

          {/* Footer: contact email. */}
          <div className="mt-14 border-t border-border pt-6">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Contact
            </p>
            <a
              href="mailto:fairysunlovesyou@gmail.com"
              className="mt-2 inline-block text-sm font-bold transition-opacity hover:opacity-60 md:text-base"
            >
              fairysunlovesyou@gmail.com
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
