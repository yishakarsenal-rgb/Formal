'use client'

import { cn } from '@/lib/utils'
import { Chapter } from '@/lib/toc-data'

interface ChapterNavProps {
  chapters: Chapter[]
  activeChapter: string
  onSelectChapter: (id: string) => void
}

export function ChapterNav({ chapters, activeChapter, onSelectChapter }: ChapterNavProps) {
  return (
    <nav aria-label="Chapters" className="flex flex-col gap-1">
      {chapters.map((chapter) => (
        <button
          key={chapter.id}
          onClick={() => onSelectChapter(chapter.id)}
          className={cn(
            'flex items-start gap-3 px-3 py-3 rounded-lg text-left transition-colors text-sm',
            activeChapter === chapter.id
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-muted text-foreground'
          )}
        >
          <span
            className={cn(
              'shrink-0 size-6 rounded-md flex items-center justify-center text-xs font-bold mt-0.5',
              activeChapter === chapter.id
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {chapter.number}
          </span>
          <div className="min-w-0">
            <p className="font-medium leading-tight truncate">{chapter.title}</p>
            <p
              className={cn(
                'text-xs mt-0.5 line-clamp-2',
                activeChapter === chapter.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
              )}
            >
              {chapter.description}
            </p>
          </div>
        </button>
      ))}
    </nav>
  )
}
