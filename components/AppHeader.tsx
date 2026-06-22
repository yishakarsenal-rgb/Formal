'use client'

import { Badge } from '@/components/ui/badge'
import { Cpu } from 'lucide-react'

export function AppHeader() {
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

        </div>
      </div>
    </header>
  )
}
