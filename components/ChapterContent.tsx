"use client";

import { Chapter } from "@/lib/toc-data";
import { ConceptSectionView } from "./ConceptSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChapterContentProps {
  chapter: Chapter;
}

export function ChapterContent({ chapter }: ChapterContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Chapter Header */}
      <div className="p-6 border-b border-border bg-card/50">
        <div className="flex items-start gap-4">
          <div className="size-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <span className="text-lg font-bold text-primary-foreground">
              {chapter.number}
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="text-xs">
                Chapter {chapter.number}
              </Badge>
            </div>
            <h2 className="text-xl font-bold text-foreground text-balance">
              {chapter.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {chapter.description}
            </p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          {chapter.sections.length === 1 ? (
            <ConceptSectionView section={chapter.sections[0]} />
          ) : (
            <Tabs
              key={chapter.number}
              defaultValue={chapter.sections[0].id}
              className="w-full"
            >
              <TabsList className="flex flex-wrap h-auto gap-1 mb-6 bg-muted p-1">
                {chapter.sections.map((section) => (
                  <TabsTrigger
                    key={section.id}
                    value={section.id}
                    className="text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    {section.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              {chapter.sections.map((section) => (
                <TabsContent
                  key={section.id}
                  value={section.id}
                  className="mt-0"
                >
                  <ConceptSectionView section={section} />
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
