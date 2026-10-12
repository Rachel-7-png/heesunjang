'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'

type Project = {
  num: string
  name: string
  desc: string
  // 이미지 뷰어용 배열 (PDF 프로젝트일 경우 비워둡니다)
  pages?: string[]
  // PDF 링크용 (새 탭으로 열기 위해 추가된 기능입니다)
  pdfLink?: string
}

// Project-specific image arrays. Kept fully separate so images never mix.
const PROJECT_01_IMAGES = [
  'https://i.ibb.co/Df9JXS2y/project01-01.jpg',
  'https://i.ibb.co/PvbdD8yr/project01-02.jpg',
  'https://i.ibb.co/jPYQycxZ/project01-03.jpg',
  'https://i.ibb.co/TxY0MHTD/project01-04.jpg',
  'https://i.ibb.co/1tPSfXzb/project01-05.jpg',
  'https://i.ibb.co/35MYCNjc/project01-06.jpg',
  'https://i.ibb.co/jdW14Kb/project01-07.jpg',
  'https://i.ibb.co/gMxWMDhr/project01-08.jpg',
  'https://i.ibb.co/C5TGkHS9/project01-09.jpg',
  'https://i.ibb.co/PsXLXrMJ/project01-10.jpg',
  'https://i.ibb.co/1fVz44Jc/project01-11.jpg',
  'https://i.ibb.co/1fTt6VtD/project01-12.jpg',
  'https://i.ibb.co/jk7yCjjy/project01-13.jpg',
]

const PROJECT_02_IMAGES = [
  'https://i.ibb.co/5h7LfMkG/project02-01.jpg',
  'https://i.ibb.co/pj691ysX/project02-02.jpg',
  'https://i.ibb.co/DDYQ5TyM/project02-03.jpg',
  'https://i.ibb.co/DHZKHyMX/project02-04.jpg',
  'https://i.ibb.co/zH5TdNtZ/project02-05.jpg',
  'https://i.ibb.co/zhgBT2yx/project02-06.jpg',
  'https://i.ibb.co/svqqj8dY/project02-07.jpg',
  'https://i.ibb.co/5gdFSVYF/project02-08.jpg',
  'https://i.ibb.co/8L27Wj6B/project02-09.jpg',
]

const PROJECT_03_IMAGES = [
  'https://i.ibb.co/1kthqpZ/project03-01.jpg',
  'https://i.ibb.co/q367tR0H/project03-02.jpg',
  'https://i.ibb.co/xKzT5SD8/project03-03.jpg',
  'https://i.ibb.co/rfvxhHJk/project03-04.jpg',
  'https://i.ibb.co/tpVRkGvB/project03-05.jpg',
  'https://i.ibb.co/kVHMrj6R/project03-06.jpg',
  'https://i.ibb.co/4RVBBVzj/project03-07.jpg',
  'https://i.ibb.co/N6xN6ZGV/project03-08.jpg',
  'https://i.ibb.co/7tZWQkY4/project03-09.jpg',
]

const PROJECTS: Project[] = [
  {
    num: '01',
    name: '레저업',
    desc: '신규 여행 앱 서비스 런칭',
    pages: PROJECT_01_IMAGES,
  },
  {
    num: '02',
    name: '거지탈출', /* <-- 여기에 새 프로젝트 제목을 적어주세요 */
    desc: '짠테크 습관 형성 미니앱 런칭', /* <-- 설명 수정 */
    pdfLink: '/shouldibuyit.pdf', /* <-- 깃허브 public 폴더에 올리신 PDF 파일 이름으로 꼭 수정해주세요! */
  },
  {
    num: '03',
    name: '소모임',
    desc: '소모임 앱 서비스 리뉴얼',
    pages: PROJECT_02_IMAGES,
  },
  {
    num: '04',
    name: '배달의 민족',
    desc: '리뷰 시스템 개선 제안',
    pages: PROJECT_03_IMAGES,
  },
]

export default function ProjectPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const active = openIndex === null ? null : PROJECTS[openIndex]

  // When a case study opens, scroll to top so it reads from the first page.
  useEffect(() => {
    if (active) window.scrollTo({ top: 0 })
  }, [active])

  // Close the case study with Escape.
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  // ---- Case study view: a vertically scrollable portfolio, no title header ----
  if (active && active.pages) {
    return (
      <section className="min-h-[calc(100vh-var(--header-h))] overflow-x-clip pb-24 pt-10 md:pt-14">
        {/* Fixed Back button */}
        <button
          type="button"
          onClick={() => setOpenIndex(null)}
          className="fixed left-6 top-[calc(var(--header-h)+0.5rem)] z-50 inline-flex items-center gap-2 text-sm font-medium tracking-wide text-white [mix-blend-mode:difference] transition-opacity hover:opacity-60 md:left-10"
        >
          <ArrowLeft size={18} strokeWidth={1.75} />
          Back
        </button>

        {/* Portfolio images */}
        <div className="mx-auto mt-0 flex w-full max-w-4xl flex-col gap-0 px-6 md:px-10">
          {active.pages.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src || '/placeholder.svg'}
              alt={`${active.name} portfolio ${i + 1}`}
              className="block h-auto w-full border-0 p-0 align-top shadow-none"
              style={{ margin: 0 }}
            />
          ))}
        </div>
      </section>
    )
  }

  // ---- Project list ----
  return (
    <section className="min-h-[calc(100vh-var(--header-h))] overflow-x-clip pb-24 pt-20">
      {/* Full-bleed list: dividers run edge to edge; content stays inset. */}
      <div className="flex flex-col border-t border-foreground">
        {PROJECTS.map((project, i) => {
          
          // PDF 링크가 있는 프로젝트일 경우 (새 탭에서 PDF 열림)
          if (project.pdfLink) {
            return (
              <a
                key={project.num}
                href={project.pdfLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-baseline gap-6 border-b border-foreground px-6 py-10 text-left transition-[padding] duration-300 md:gap-10 md:px-10 md:py-14 md:hover:pl-16 cursor-pointer"
              >
                <span className="text-lg font-medium tabular-nums tracking-tight md:text-2xl">
                  {project.num}
                </span>
                <span className="flex flex-1 flex-col gap-1 opacity-100 transition-opacity duration-300 md:gap-2 md:opacity-0 md:group-hover:opacity-100">
                  <span className="text-2xl font-bold tracking-tight md:text-4xl">
                    {project.name}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground md:text-base">
                    {project.desc}
                  </span>
                </span>
              </a>
            )
          }

          // 일반 이미지 뷰어 프로젝트일 경우 (기존 동작)
          return (
            <button
              key={project.num}
              type="button"
              onClick={() => setOpenIndex(i)}
              className="group relative flex items-baseline gap-6 border-b border-foreground px-6 py-10 text-left transition-[padding] duration-300 md:gap-10 md:px-10 md:py-14 md:hover:pl-16"
            >
              <span className="text-lg font-medium tabular-nums tracking-tight md:text-2xl">
                {project.num}
              </span>

              <span className="flex flex-1 flex-col gap-1 opacity-100 transition-opacity duration-300 md:gap-2 md:opacity-0 md:group-hover:opacity-100">
                <span className="text-2xl font-bold tracking-tight md:text-4xl">
                  {project.name}
                </span>
                <span className="text-sm font-medium text-muted-foreground md:text-base">
                  {project.desc}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
