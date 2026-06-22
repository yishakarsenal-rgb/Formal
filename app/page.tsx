'use client'

import { useState } from 'react'
import { AppHeader } from '@/components/AppHeader'
import { ChapterNav } from '@/components/ChapterNav'
import { ChapterContent } from '@/components/ChapterContent'
import { Calculator } from '@/components/Calculator'
import { QuickReference } from '@/components/QuickReference'
import { MockExam } from '@/components/MockExam'
import { ThreeDBackground } from '@/components/ThreeDBackground'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { chapters } from '@/lib/toc-data'
import {
  Calculator as CalcIcon,
  BookOpen,
  Menu,
  X,
  ClipboardList,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ActiveTab = 'study' | 'exam'

export default function Page() {
  const [activeChapter, setActiveChapter] = useState(chapters[0].id)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<ActiveTab>('study')

  const currentChapter = chapters.find((c) => c.id === activeChapter) ?? chapters[0]

  return (
    <div className="flex flex-col min-h-screen bg-background relative">
      {/* 3D floating background — rendered behind everything */}
      <ThreeDBackground />

      {/* All foreground content sits above the 3D canvas */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <AppHeader />

        {/* Tab switcher */}
        <div className="border-b border-border bg-card/70 backdrop-blur-sm shrink-0">
          <div className="max-w-screen-2xl mx-auto px-4 flex items-center gap-1 h-11">
            <button
              onClick={() => setActiveTab('study')}
              className={cn(
                'flex items-center gap-2 px-4 h-full text-sm font-medium border-b-2 transition-colors',
                activeTab === 'study'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <BookOpen className="size-4" />
              Study Guide
            </button>
            <button
              onClick={() => setActiveTab('exam')}
              className={cn(
                'flex items-center gap-2 px-4 h-full text-sm font-medium border-b-2 transition-colors',
                activeTab === 'exam'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <ClipboardList className="size-4" />
              Mock Exam
            </button>
          </div>
        </div>

        {/* ── STUDY TAB ── */}
        {activeTab === 'study' && (
          <>
            {/* Mobile sidebar toggle */}
            <div className="lg:hidden flex items-center gap-2 px-4 py-2 border-b border-border bg-card/50">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                className="gap-2"
              >
                {mobileSidebarOpen ? <X className="size-4" /> : <Menu className="size-4" />}
                {mobileSidebarOpen ? 'Close' : 'Chapters'}
              </Button>
              <span className="text-sm text-muted-foreground">{currentChapter.title}</span>
            </div>

            {/* Mobile sidebar overlay */}
            {mobileSidebarOpen && (
              <div className="lg:hidden fixed inset-0 z-50 flex">
                <div
                  className="fixed inset-0 bg-black/40"
                  onClick={() => setMobileSidebarOpen(false)}
                />
                <div className="relative w-72 bg-background border-r border-border z-10 flex flex-col">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="size-4 text-primary" />
                      <span className="text-sm font-semibold">Chapters</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMobileSidebarOpen(false)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                  <ScrollArea className="flex-1 p-3">
                    <ChapterNav
                      chapters={chapters}
                      activeChapter={activeChapter}
                      onSelectChapter={(id) => {
                        setActiveChapter(id)
                        setMobileSidebarOpen(false)
                      }}
                    />
                  </ScrollArea>
                </div>
              </div>
            )}

            {/* Main layout */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left sidebar — chapters */}
              <aside className="hidden lg:flex w-72 flex-col border-r border-border bg-card/40 backdrop-blur-sm shrink-0">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <BookOpen className="size-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">Chapters</span>
                  </div>
                </div>
                <ScrollArea className="flex-1 p-3">
                  <ChapterNav
                    chapters={chapters}
                    activeChapter={activeChapter}
                    onSelectChapter={setActiveChapter}
                  />
                </ScrollArea>
              </aside>

              {/* Center — chapter content */}
              <main className="flex-1 min-w-0 overflow-hidden bg-background/60 backdrop-blur-sm">
                <ChapterContent chapter={currentChapter} />
              </main>

              {/* Right sidebar — reference + calculator */}
              <aside className="hidden xl:flex w-80 flex-col border-l border-border bg-card/40 backdrop-blur-sm shrink-0 overflow-y-auto">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <BookOpen className="size-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">Reference</span>
                  </div>
                </div>
                <div className="flex-1 p-4">
                  <QuickReference />
                </div>
                <Separator />
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <CalcIcon className="size-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">Calculator</span>
                  </div>
                  <Calculator />
                </div>
              </aside>
            </div>

          </>
        )}

        {/* ── EXAM TAB ── */}
        {activeTab === 'exam' && (
          <div className="flex-1 overflow-hidden bg-background/60 backdrop-blur-sm">
            <MockExam />
          </div>
        )}

        {/* ── BOTTOM CALCULATOR BAR ── always visible */}
        <BottomCalculatorBar />

        {/* Footer */}
        <footer className="border-t border-border bg-card/80 backdrop-blur-sm py-4 px-6 shrink-0">
          <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              Theory of Computation Interactive Study Guide
            </p>
            <p className="text-xs text-muted-foreground">
              Developed by{' '}
              <span className="font-semibold text-foreground tracking-wide">Yishak</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

function BottomCalculatorBar() {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-t border-border bg-card/90 backdrop-blur-sm shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted/40 transition-colors"
        aria-expanded={open}
        aria-controls="bottom-calculator"
      >
        <div className="flex items-center gap-2">
          <CalcIcon className="size-4 text-primary" />
          <span>Calculator</span>
        </div>
        <span className="text-xs text-muted-foreground select-none">
          {open ? '▼ Hide' : '▲ Show'}
        </span>
      </button>
      {open && (
        <div
          id="bottom-calculator"
          className="pb-6 pt-2 animate-in slide-in-from-bottom-4 duration-200"
        >
          <Calculator />
        </div>
      )}
    </div>
  )
}
