'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Cpu, Sun, Moon } from 'lucide-react'

export function AppHeader() {
  const [dark, setDark] = useState(false)

  function applyTheme(isDark: boolean) {
    const html = document.documentElement
    html.classList.toggle('dark', isDark)
    // Directly set background on both html and body so the colour is
    // immediately visible even before CSS custom properties repaint.
    const bg = isDark ? '#1a2744' : '#bae0f7'
    html.style.backgroundColor = bg
    document.body.style.backgroundColor = bg
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  // On mount, read saved preference
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = saved === 'dark' || (!saved && prefersDark)
    setDark(isDark)
    applyTheme(isDark)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function toggleDark() {
    const next = !dark
    setDark(next)
    applyTheme(next)
  }

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-40">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg shrink-0">
            <Cpu className="size-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground leading-tight">
              Theory of Computation
            </h1>
            <p className="text-xs text-muted-foreground">Interactive Study Guide</p>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Badge variant="secondary" className="text-xs hidden sm:flex">
            Chapters 1–6
          </Badge>
          <Badge variant="outline" className="text-xs hidden md:flex">
            Automata · Languages · TMs
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleDark}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="gap-1.5"
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            <span className="hidden sm:inline text-xs">{dark ? 'Light' : 'Dark'}</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
