"use client";

import { motion } from "framer-motion";
import {
  Lightbulb,
  TrendingUp,
  BookOpen,
  Target,
  Clock,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

interface RecommendationPanelProps {
  feature: string;
}

const featureRecommendations: Record<string, {
  tips: string[];
  nextSteps: string[];
  relatedFeatures: string[];
}> = {
  concept: {
    tips: [
      "Break down complex topics into smaller parts",
      "Use diagrams to visualize relationships",
      "Connect new concepts to what you already know",
      "Practice explaining concepts in your own words",
    ],
    nextSteps: [
      "Generate a quiz on this topic",
      "View related concepts",
      "Add to your study plan",
    ],
    relatedFeatures: ["quiz", "studyplan"],
  },
  pyq: {
    tips: [
      "Focus on high-frequency topics first",
      "Understand the exam pattern before deep-diving",
      "Practice similar questions from identified topics",
      "Time yourself while solving past papers",
    ],
    nextSteps: [
      "Generate a study plan based on analysis",
      "Start with the most important topic",
      "Take a practice quiz",
    ],
    relatedFeatures: ["studyplan", "quiz"],
  },
  syllabus: {
    tips: [
      "Mark topics you already know",
      "Prioritize topics based on weightage",
      "Create a realistic timeline for completion",
      "Review and adjust your plan weekly",
    ],
    nextSteps: [
      "Generate a personalized study plan",
      "Start with the first unit",
      "Analyze PYQ for your syllabus",
    ],
    relatedFeatures: ["studyplan", "pyq"],
  },
  studyplan: {
    tips: [
      "Stick to your schedule consistently",
      "Take breaks to avoid burnout",
      "Review completed topics weekly",
      "Adjust the plan if you fall behind",
    ],
    nextSteps: [
      "Start today's first task",
      "Review your progress",
      "Take a break if needed",
    ],
    relatedFeatures: ["concept", "quiz"],
  },
  quiz: {
    tips: [
      "Read each question carefully",
      "Eliminate obviously wrong answers first",
      "Manage your time per question",
      "Review incorrect answers to learn",
    ],
    nextSteps: [
      "Review concepts for wrong answers",
      "Take another quiz",
      "Update your study plan",
    ],
    relatedFeatures: ["concept", "studyplan"],
  },
  simulation: {
    tips: [
      "Experiment with different parameters",
      "Observe patterns and relationships",
      "Take notes while exploring",
      "Connect visual learning to theory",
    ],
    nextSteps: [
      "Read about the underlying concepts",
      "Try a related simulation",
      "Test your understanding with a quiz",
    ],
    relatedFeatures: ["concept", "quiz"],
  },
};

const featureLabels: Record<string, string> = {
  concept: "Concept Explanation",
  pyq: "PYQ Analysis",
  syllabus: "Syllabus",
  studyplan: "Study Plan",
  quiz: "Quiz",
  simulation: "Simulation",
};

export function RecommendationPanel({ feature }: RecommendationPanelProps) {
  const recommendations = featureRecommendations[feature] || featureRecommendations.concept;

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-4">
        {/* Quick Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-primary" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Today&apos;s Goal</span>
                <span>60%</span>
              </div>
              <Progress value={60} className="h-1.5" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="rounded-lg bg-muted p-2">
                <p className="text-lg font-bold">7</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <p className="text-lg font-bold">28h</p>
                <p className="text-xs text-muted-foreground">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendations.tips.map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500 shrink-0" />
                  {tip}
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-primary" />
              Suggested Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recommendations.nextSteps.map((step, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start h-auto py-2 px-2 text-xs"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-[10px] font-medium text-primary mr-2">
                    {index + 1}
                  </div>
                  <span className="flex-1 text-left">{step}</span>
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Related Features */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-primary" />
              Try Related Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {recommendations.relatedFeatures.map((relatedFeature) => (
                <Badge
                  key={relatedFeature}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80"
                >
                  {featureLabels[relatedFeature]}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reminder */}
        <Card className="border-yellow-200 bg-yellow-50/50 dark:border-yellow-900 dark:bg-yellow-950/20">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertCircle className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200">
                Daily Reminder
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                You have 2 topics left to complete today&apos;s goal.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Time Spent */}
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Session Time</p>
              <p className="text-xs text-muted-foreground">45 minutes today</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}

export default RecommendationPanel;
