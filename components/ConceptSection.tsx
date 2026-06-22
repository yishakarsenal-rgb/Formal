'use client'

import { ConceptSection as IConceptSection } from '@/lib/toc-data'
import { ExampleCard } from './ExampleCard'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { BookOpen, FlaskConical } from 'lucide-react'

interface ConceptSectionProps {
  section: IConceptSection
}

export function ConceptSectionView({ section }: ConceptSectionProps) {
  const sortedExamples = section.examples
    ? [...section.examples].sort((a, b) => {
        const order = { easy: 0, medium: 1, hard: 2 }
        return order[a.difficulty] - order[b.difficulty]
      })
    : []

  const formatContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={i} className="font-semibold text-foreground mt-3 mb-1">
            {line.replace(/\*\*/g, '')}
          </p>
        )
      }
      if (line.startsWith('- ')) {
        return (
          <li key={i} className="ml-4 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
            {formatInline(line.slice(2))}
          </li>
        )
      }
      if (line.startsWith('| ')) {
        return (
          <p key={i} className="text-xs font-mono text-muted-foreground leading-loose">
            {line}
          </p>
        )
      }
      if (line.trim() === '') return <div key={i} className="h-1" />
      return (
        <p key={i} className="text-sm text-muted-foreground leading-relaxed">
          {formatInline(line)}
        </p>
      )
    })
  }

  const formatInline = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-foreground">{part.replace(/\*\*/g, '')}</strong>
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="font-mono text-xs bg-muted px-1 py-0.5 rounded">{part.replace(/`/g, '')}</code>
      }
      return part
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="size-4 text-primary" />
          <h3 className="text-base font-semibold text-foreground">{section.title}</h3>
        </div>

        <div className="space-y-1 pl-2 border-l-2 border-border">
          {formatContent(section.content)}
        </div>

        {section.formula && (
          <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Key Formula</p>
            <code className="text-sm font-mono text-foreground font-medium">{section.formula}</code>
          </div>
        )}
      </div>

      {sortedExamples.length > 0 && (
        <>
          <Separator />
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FlaskConical className="size-4 text-primary" />
              <h4 className="text-sm font-semibold text-foreground">Examples</h4>
              <div className="flex items-center gap-1 ml-1">
                <Badge variant="outline" className="text-xs py-0">Easy → Hard</Badge>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-1">
              {sortedExamples.map((example, idx) => (
                <ExampleCard key={example.id} example={example} index={idx} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
