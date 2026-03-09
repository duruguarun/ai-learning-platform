"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  FileSearch,
  FileText,
  Calendar,
  HelpCircle,
  PlayCircle,
  LayoutDashboard,
  Library,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const featureItems = [
  { id: "concept", label: "Explain Concepts", icon: Lightbulb },
  { id: "pyq", label: "Analyze PYQ", icon: FileSearch },
  { id: "syllabus", label: "Upload Syllabus", icon: FileText },
  { id: "studyplan", label: "Study Plan", icon: Calendar },
  { id: "quiz", label: "Practice Quiz", icon: HelpCircle },
  { id: "simulation", label: "Simulation", icon: PlayCircle },
];

const mainNavItems = [
  { href: "/features", label: "Feature Hub", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/library", label: "Library", icon: Library },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [collapsed, setCollapsed] = useState(false);
  
  const currentFeature = searchParams.get("feature");
  const isWorkspace = pathname === "/workspace";

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 64 : 256 }}
        className={cn(
          "relative flex h-full flex-col border-r border-border bg-sidebar",
          className
        )}
      >
        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border border-border bg-background shadow-sm"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>

        {/* Main Navigation */}
        <div className="flex flex-col gap-1 p-3">
          <div className={cn("mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground", collapsed && "sr-only")}>
            Navigation
          </div>
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            const NavButton = (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Button>
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{NavButton}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            }

            return NavButton;
          })}
        </div>

        {/* Divider */}
        <div className="mx-3 border-t border-border" />

        {/* Feature Modules - shown when in workspace */}
        {isWorkspace && (
          <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
            <div className={cn("mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground", collapsed && "sr-only")}>
              Features
            </div>
            {featureItems.map((item) => {
              const isActive = currentFeature === item.id;
              const FeatureButton = (
                <Link key={item.id} href={`/workspace?feature=${item.id}`}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3",
                      collapsed && "justify-center px-2",
                      isActive && "bg-secondary"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Button>
                </Link>
              );

              if (collapsed) {
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>{FeatureButton}</TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                );
              }

              return FeatureButton;
            })}
          </div>
        )}

        {/* Quick Stats - shown when not collapsed */}
        {!collapsed && !isWorkspace && (
          <div className="mt-auto border-t border-border p-4">
            <div className="rounded-lg bg-muted p-3">
              <div className="text-xs font-medium text-muted-foreground">Today&apos;s Progress</div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-bold">42%</span>
                <span className="text-xs text-muted-foreground">completed</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-background">
                <div className="h-full w-[42%] rounded-full bg-primary" />
              </div>
            </div>
          </div>
        )}
      </motion.aside>
    </TooltipProvider>
  );
}

export default Sidebar;
