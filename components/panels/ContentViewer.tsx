"use client";

import { motion } from "framer-motion";
import { FileText, BookOpen, BarChart3, Calendar, HelpCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/lib/store/useAppStore";

const contentTypeIcons: Record<string, typeof FileText> = {
  concept: BookOpen,
  "pyq-analysis": BarChart3,
  syllabus: FileText,
  "study-plan": Calendar,
  "quiz-result": HelpCircle,
};

const contentTypeLabels: Record<string, string> = {
  concept: "Concept Explanation",
  "pyq-analysis": "PYQ Analysis",
  syllabus: "Parsed Syllabus",
  "study-plan": "Study Plan",
  "quiz-result": "Quiz Results",
};

export function ContentViewer() {
  const { currentContent, generatedContent } = useAppStore();

  if (!currentContent) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-medium">No Content Yet</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          Use the feature modules on the left to generate content. Your generated
          explanations, analyses, and results will appear here.
        </p>
      </div>
    );
  }

  const Icon = contentTypeIcons[currentContent.type] || FileText;
  const typeLabel = contentTypeLabels[currentContent.type] || currentContent.type;

  const renderContent = () => {
    switch (currentContent.type) {
      case "concept":
        const conceptData = currentContent.content as {
          topic: string;
          explanation: string;
          relatedTopics: string[];
        };
        return (
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {conceptData.explanation.split("\n").map((line, index) => {
                if (line.startsWith("# ")) {
                  return (
                    <h2 key={index} className="text-xl font-bold mt-6 mb-3">
                      {line.replace("# ", "")}
                    </h2>
                  );
                }
                if (line.startsWith("## ")) {
                  return (
                    <h3 key={index} className="text-lg font-semibold mt-4 mb-2">
                      {line.replace("## ", "")}
                    </h3>
                  );
                }
                if (line.startsWith("### ")) {
                  return (
                    <h4 key={index} className="text-base font-medium mt-3 mb-1">
                      {line.replace("### ", "")}
                    </h4>
                  );
                }
                if (line.startsWith("- ")) {
                  return (
                    <li key={index} className="ml-4">
                      {line.replace("- ", "")}
                    </li>
                  );
                }
                if (line.trim()) {
                  return (
                    <p key={index} className="my-2 text-muted-foreground">
                      {line}
                    </p>
                  );
                }
                return null;
              })}
            </div>
            <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">Related:</span>
              {conceptData.relatedTopics.map((topic) => (
                <Badge key={topic} variant="secondary">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        );

      case "pyq-analysis":
        const pyqData = currentContent.content as {
          totalQuestions: number;
          importantTopics: Array<{ topic: string; percentage: number }>;
        };
        return (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Total Questions</p>
                  <p className="text-2xl font-bold">{pyqData.totalQuestions}</p>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-2">
              {pyqData.importantTopics?.slice(0, 5).map((topic, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <span>{topic.topic}</span>
                  <Badge variant="outline">{topic.percentage}%</Badge>
                </div>
              ))}
            </div>
          </div>
        );

      case "quiz-result":
        const quizData = currentContent.content as {
          score: number;
          correctAnswers: number;
          totalQuestions: number;
        };
        return (
          <div className="text-center py-8">
            <div className="text-5xl font-bold text-primary">{quizData.score}%</div>
            <p className="mt-2 text-muted-foreground">
              {quizData.correctAnswers} of {quizData.totalQuestions} correct
            </p>
          </div>
        );

      default:
        return (
          <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto">
            {JSON.stringify(currentContent.content, null, 2)}
          </pre>
        );
    }
  };

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Current Content */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{currentContent.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span>{typeLabel}</span>
                      <span className="text-muted-foreground">|</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(currentContent.createdAt).toLocaleTimeString()}
                      </span>
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline">Latest</Badge>
              </div>
            </CardHeader>
            <CardContent>{renderContent()}</CardContent>
          </Card>

          {/* Previous Content */}
          {generatedContent.length > 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Previous Content
              </h3>
              <div className="space-y-2">
                {generatedContent.slice(1, 4).map((content, index) => {
                  const ContentIcon = contentTypeIcons[content.type] || FileText;
                  return (
                    <Card
                      key={index}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <CardContent className="flex items-center gap-3 p-3">
                        <ContentIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {content.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {contentTypeLabels[content.type]}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(content.createdAt).toLocaleDateString()}
                        </span>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </ScrollArea>
    </div>
  );
}

export default ContentViewer;
