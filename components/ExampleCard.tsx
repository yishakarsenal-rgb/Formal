"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Example, difficultyColors } from "@/lib/toc-data";
import { cn } from "@/lib/utils";

interface ExampleCardProps {
  example: Example;
  index: number;
}

const difficultyLabel: Record<string, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export function ExampleCard({ example, index }: ExampleCardProps) {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">
              {index + 1}
            </span>
            <Badge
              className={cn(
                "text-xs font-semibold border-0",
                difficultyColors[example.difficulty],
              )}
            >
              {difficultyLabel[example.difficulty]}
            </Badge>
          </div>
        </div>
        <CardTitle className="text-sm font-semibold mt-1">
          {example.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {example.description}
        </p>

        <Button
          variant={showSolution ? "default" : "outline"}
          size="sm"
          onClick={() => setShowSolution(!showSolution)}
          className="w-full gap-2"
        >
          {showSolution ? "Hide Solution " : "Show Solution "}
        </Button>

        {showSolution && (
          <div className="rounded-lg bg-muted/50 border border-border p-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <pre className="text-xs font-mono leading-relaxed whitespace-pre-wrap text-foreground">
              {example.solution}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
