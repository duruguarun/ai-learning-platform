"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Lightbulb, Loader2, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store/useAppStore";
import { conceptAPI } from "@/lib/services/api";
import { mockConceptResponse } from "@/lib/mock/mockData";

const suggestedTopics = [
  "Neural Networks",
  "Photosynthesis",
  "Quantum Mechanics",
  "Data Structures",
  "Thermodynamics",
  "Machine Learning",
];

export function ConceptModule() {
  const [searchTopic, setSearchTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<typeof mockConceptResponse | null>(null);

  const { addGeneratedContent, addWorkflowStep } = useAppStore();

  const handleExplainConcept = async (topic: string) => {
    if (!topic.trim()) return;

    setIsLoading(true);
    setExplanation(null);

    // Add workflow step
    addWorkflowStep({
      id: `concept-${Date.now()}`,
      title: `Explain: ${topic}`,
      type: "concept",
      status: "active",
      data: { topic },
    });

    try {
      const response = await conceptAPI.explainConcept(topic);
      
      if (response.success) {
        setExplanation(response.data);
        
        // Store in global state for content viewer
        addGeneratedContent({
          type: "concept",
          title: topic,
          content: response.data,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Failed to explain concept:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleExplainConcept(searchTopic);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500">
            <Lightbulb className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Explain Concepts</h2>
            <p className="text-sm text-muted-foreground">
              Enter any topic and get AI-powered explanations
            </p>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Enter a topic (e.g., Neural Networks, Photosynthesis)"
                value={searchTopic}
                onChange={(e) => setSearchTopic(e.target.value)}
                className="pl-10 pr-24"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 gap-2"
                disabled={!searchTopic.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Explain
                    <Sparkles className="h-3 w-3" />
                  </>
                )}
              </Button>
            </div>

            {/* Suggested Topics */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground">Try:</span>
              {suggestedTopics.map((topic) => (
                <Badge
                  key={topic}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80"
                  onClick={() => {
                    setSearchTopic(topic);
                    handleExplainConcept(topic);
                  }}
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="mt-4 text-muted-foreground">
            Generating explanation for &quot;{searchTopic}&quot;...
          </p>
        </motion.div>
      )}

      {/* Explanation Result */}
      {explanation && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  {explanation.topic}
                </CardTitle>
                <Badge variant="outline">AI Generated</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {explanation.explanation.split("\n").map((line, index) => {
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
                  if (line.match(/^\d+\./)) {
                    return (
                      <li key={index} className="ml-4">
                        {line}
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
            </CardContent>
          </Card>

          {/* Related Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Related Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {explanation.relatedTopics.map((topic) => (
                  <Button
                    key={topic}
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => {
                      setSearchTopic(topic);
                      handleExplainConcept(topic);
                    }}
                  >
                    {topic}
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Diagrams Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Visual Diagrams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {explanation.diagrams.map((diagram, index) => (
                  <div
                    key={index}
                    className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50"
                  >
                    <div className="text-center">
                      <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 p-3">
                        <Sparkles className="h-full w-full text-primary" />
                      </div>
                      <p className="mt-2 text-sm font-medium">{diagram.title}</p>
                      <p className="text-xs text-muted-foreground">
                        AI-generated diagram
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Empty State */}
      {!explanation && !isLoading && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Lightbulb className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-medium">Start Learning</h3>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              Enter any topic above to get a detailed AI-powered explanation
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ConceptModule;
