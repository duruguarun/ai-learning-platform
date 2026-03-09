"use client";

import { motion } from "framer-motion";
import { Check, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkflowStepProps {
  title: string;
  description?: string;
  status: "pending" | "active" | "completed";
  icon?: React.ReactNode;
  isLast?: boolean;
}

export function WorkflowStep({
  title,
  description,
  status,
  icon,
  isLast = false,
}: WorkflowStepProps) {
  return (
    <div className="relative flex gap-4">
      {/* Connector Line */}
      {!isLast && (
        <div
          className={cn(
            "absolute left-4 top-8 h-full w-0.5 -translate-x-1/2",
            status === "completed" ? "bg-primary" : "bg-border"
          )}
        />
      )}

      {/* Step Indicator */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn(
          "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          status === "completed" && "border-primary bg-primary text-primary-foreground",
          status === "active" && "border-primary bg-background",
          status === "pending" && "border-muted bg-background"
        )}
      >
        {status === "completed" ? (
          <Check className="h-4 w-4" />
        ) : status === "active" ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <Loader2 className="h-4 w-4 text-primary" />
          </motion.div>
        ) : icon ? (
          icon
        ) : (
          <Circle className="h-3 w-3 text-muted-foreground" />
        )}
      </motion.div>

      {/* Step Content */}
      <div className="flex-1 pb-8">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "rounded-lg border border-border p-3 transition-colors",
            status === "active" && "border-primary bg-primary/5",
            status === "completed" && "bg-muted/50"
          )}
        >
          <h4
            className={cn(
              "text-sm font-medium",
              status === "completed" && "text-muted-foreground"
            )}
          >
            {title}
          </h4>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default WorkflowStep;
