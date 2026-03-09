"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Loader2, Clock, BookOpen, Target, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useAppStore } from "@/lib/store/useAppStore";
import { studyPlanAPI } from "@/lib/services/api";
import { mockStudyPlan } from "@/lib/mock/mockData";

const taskTypeColors: Record<string, string> = {
  study: "bg-blue-500",
  practice: "bg-green-500",
  review: "bg-orange-500",
  quiz: "bg-purple-500",
};

const taskTypeBadgeColors: Record<string, string> = {
  study: "bg-blue-100 text-blue-700",
  practice: "bg-green-100 text-green-700",
  review: "bg-orange-100 text-orange-700",
  quiz: "bg-purple-100 text-purple-700",
};

export function StudyPlanModule() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [studyPlan, setStudyPlan] = useState<typeof mockStudyPlan | null>(null);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [config, setConfig] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    hoursPerWeek: 20,
  });

  const { selectedTopics, addGeneratedContent, addWorkflowStep } = useAppStore();

  const handleGeneratePlan = async () => {
    setIsGenerating(true);

    addWorkflowStep({
      id: `studyplan-${Date.now()}`,
      title: "Generate Study Plan",
      type: "studyplan",
      status: "active",
    });

    try {
      const response = await studyPlanAPI.generateStudyPlan({
        topics: selectedTopics,
        startDate: config.startDate,
        endDate: config.endDate,
        hoursPerWeek: config.hoursPerWeek,
      });
      
      if (response.success) {
        setStudyPlan(response.data);
        
        addGeneratedContent({
          type: "study-plan",
          title: "Personalized Study Plan",
          content: response.data,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Failed to generate study plan:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const calculateTotalHours = (week: typeof mockStudyPlan.weeks[0]) => {
    return week.tasks.reduce((acc, task) => acc + task.duration, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Generate Study Plan</h2>
            <p className="text-sm text-muted-foreground">
              Create a personalized weekly study schedule
            </p>
          </div>
        </div>
      </div>

      {/* Configuration */}
      {!studyPlan && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Plan Configuration</CardTitle>
            <CardDescription>
              Customize your study plan parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={config.startDate}
                  onChange={(e) => setConfig({ ...config, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={config.endDate}
                  onChange={(e) => setConfig({ ...config, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Hours per Week</Label>
                <span className="text-sm font-medium">{config.hoursPerWeek} hours</span>
              </div>
              <Slider
                value={[config.hoursPerWeek]}
                onValueChange={([value]) => setConfig({ ...config, hoursPerWeek: value })}
                max={40}
                min={5}
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5 hrs (Light)</span>
                <span>20 hrs (Moderate)</span>
                <span>40 hrs (Intensive)</span>
              </div>
            </div>

            {selectedTopics.length > 0 && (
              <div className="space-y-2">
                <Label>Topics to Cover ({selectedTopics.length})</Label>
                <div className="flex flex-wrap gap-1">
                  {selectedTopics.slice(0, 5).map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                  {selectedTopics.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{selectedTopics.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <Button
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="w-full gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Target className="h-4 w-4" />
                  Generate Study Plan
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="mt-4 text-muted-foreground">
            Creating your personalized study plan...
          </p>
        </motion.div>
      )}

      {/* Study Plan Display */}
      {studyPlan && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Study Plan</CardTitle>
                  <CardDescription>
                    {studyPlan.startDate} to {studyPlan.endDate}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" />
                  {studyPlan.weeklyHours}h/week
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                {Object.entries(taskTypeColors).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${color}`} />
                    <span className="text-xs capitalize text-muted-foreground">{type}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Week Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
              disabled={currentWeek === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="font-medium">
              Week {currentWeek + 1} - {studyPlan.weeks[currentWeek]?.focus}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeek(Math.min(studyPlan.weeks.length - 1, currentWeek + 1))}
              disabled={currentWeek === studyPlan.weeks.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Weekly Schedule */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Week {studyPlan.weeks[currentWeek].week} Schedule
                </CardTitle>
                <Badge variant="secondary">
                  {calculateTotalHours(studyPlan.weeks[currentWeek])} hours
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {studyPlan.weeks[currentWeek].tasks.map((task, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 rounded-lg border border-border p-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-sm font-medium">
                      {task.day}
                    </div>
                    <div className={`h-full w-1 rounded-full ${taskTypeColors[task.type]}`} />
                    <div className="flex-1">
                      <p className="font-medium">{task.topic}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={`text-xs ${taskTypeBadgeColors[task.type]}`}>
                          {task.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {task.duration} hours
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Study Sessions</p>
                  <p className="text-xl font-bold">
                    {studyPlan.weeks.reduce((acc, w) => acc + w.tasks.filter(t => t.type === "study").length, 0)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quiz Sessions</p>
                  <p className="text-xl font-bold">
                    {studyPlan.weeks.reduce((acc, w) => acc + w.tasks.filter(t => t.type === "quiz").length, 0)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                  <p className="text-xl font-bold">
                    {studyPlan.weeks.reduce((acc, w) => acc + calculateTotalHours(w), 0)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setStudyPlan(null)}
            >
              Regenerate Plan
            </Button>
            <Button className="gap-2">
              Start Learning
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default StudyPlanModule;
