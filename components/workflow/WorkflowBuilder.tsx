"use client";

import { motion } from "framer-motion";
import {
  Lightbulb,
  FileSearch,
  FileText,
  Calendar,
  HelpCircle,
  PlayCircle,
  Plus,
  Check,
  Circle,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store/useAppStore";

const featureIcons: Record<string, typeof Lightbulb> = {
  concept: Lightbulb,
  pyq: FileSearch,
  syllabus: FileText,
  studyplan: Calendar,
  quiz: HelpCircle,
  simulation: PlayCircle,
};

const featureLabels: Record<string, string> = {
  concept: "Concept Explanation",
  pyq: "PYQ Analysis",
  syllabus: "Syllabus Parsing",
  studyplan: "Study Plan",
  quiz: "Practice Quiz",
  simulation: "Simulation",
};

interface WorkflowBuilderProps {
  feature: string;
}

export function WorkflowBuilder({ feature }: WorkflowBuilderProps) {
  const { workflowSteps, activeStepIndex, addWorkflowStep, setActiveStepIndex } = useAppStore();

  const handleAddStep = () => {
    const newStep = {
      id: `step-${Date.now()}`,
      title: "New Step",
      type: feature,
      status: "pending" as const,
    };
    addWorkflowStep(newStep);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border p-4">
        <h3 className="text-sm font-semibold">Workflow</h3>
        <p className="text-xs text-muted-foreground">Track your learning journey</p>
      </div>

      {/* Workflow Steps */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {workflowSteps.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Circle className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                No workflow steps yet
              </p>
              <p className="text-xs text-muted-foreground">
                Start using features to build your workflow
              </p>
            </div>
          ) : (
            <div className="relative space-y-2">
              {/* Connector Line */}
              <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-border" />

              {workflowSteps.map((step, index) => {
                const Icon = featureIcons[step.type] || Circle;
                const isActive = index === activeStepIndex;
                const isCompleted = step.status === "completed";

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "relative flex items-start gap-3 rounded-lg p-2 transition-colors cursor-pointer",
                      isActive && "bg-primary/5",
                      !isActive && "hover:bg-muted/50"
                    )}
                    onClick={() => setActiveStepIndex(index)}
                  >
                    {/* Step Indicator */}
                    <div
                      className={cn(
                        "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        isCompleted && "bg-green-500 text-white",
                        isActive && !isCompleted && "bg-primary text-primary-foreground",
                        !isActive && !isCompleted && "bg-muted text-muted-foreground"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0 pt-1">
                      <p
                        className={cn(
                          "text-sm font-medium truncate",
                          isCompleted && "text-muted-foreground line-through"
                        )}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {featureLabels[step.type] || step.type}
                      </p>
                    </div>

                    {/* Active Indicator */}
                    {isActive && (
                      <ChevronRight className="h-4 w-4 text-primary shrink-0" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Add Step Button */}
      <div className="border-t border-border p-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2"
          onClick={handleAddStep}
        >
          <Plus className="h-4 w-4" />
          Add Step
        </Button>
      </div>

      {/* Current Feature Info */}
      <div className="border-t border-border p-4">
        <div className="rounded-lg bg-muted p-3">
          <div className="flex items-center gap-2">
            {(() => {
              const Icon = featureIcons[feature] || Circle;
              return <Icon className="h-4 w-4 text-primary" />;
            })()}
            <span className="text-xs font-medium">Current Feature</span>
          </div>
          <p className="mt-1 text-sm font-medium">
            {featureLabels[feature] || feature}
          </p>
        </div>
      </div>
    </div>
  );
}

export default WorkflowBuilder;
