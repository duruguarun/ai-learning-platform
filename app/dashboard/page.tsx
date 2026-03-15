"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  Target,
  TrendingUp,
  Calendar,
  ChevronRight,
  Play,
  FileText,
  Brain,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/store/useAppStore";
import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link";

export default function DashboardPage() {
  const user = useAppStore((state) => state.user);
  const studyPlan = useAppStore((state) => state.studyPlan);
  const fetchDashboardData = useAppStore((state) => state.fetchDashboardData);
  const setActivePage = useAppStore((state) => state.setActivePage);

  useEffect(() => {
    if (setActivePage) setActivePage("dashboard");
    if (fetchDashboardData) fetchDashboardData();
  }, [fetchDashboardData, setActivePage]);

  const stats = [
    {
      title: "Study Streak",
      value: user?.studyStreak || 7,
      unit: "days",
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "Hours This Week",
      value: "12.5",
      unit: "hrs",
      icon: Clock,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Concepts Mastered",
      value: "47",
      unit: "",
      icon: Brain,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Overall Progress",
      value: "68",
      unit: "%",
      icon: Target,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
  ];

  const recentActivities = [
    {
      title: "Completed Quiz: Thermodynamics",
      time: "2 hours ago",
      type: "quiz",
      score: "85%",
    },
    {
      title: "Uploaded: Physics Notes Ch. 5",
      time: "5 hours ago",
      type: "upload",
    },
    {
      title: "Studied: Electromagnetic Waves",
      time: "Yesterday",
      type: "study",
      duration: "45 min",
    },
    {
      title: "Generated Study Plan: Chemistry",
      time: "2 days ago",
      type: "plan",
    },
  ];

  const upcomingTasks = studyPlan?.tasks.slice(0, 4) || [
    { title: "Review Organic Chemistry", duration: "1 hr", priority: "high" },
    { title: "Practice PYQ - Physics", duration: "45 min", priority: "medium" },
    { title: "Read Chapter 6 - Maths", duration: "30 min", priority: "low" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="px-4 pb-8 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Welcome Section */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                Welcome back, {user?.name || "Student"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                {"Here's"} your learning progress for today
              </p>
            </div>

            {/* Stats Grid */}
            <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border-border/50">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className={`p-2 sm:p-3 rounded-xl ${stat.bg}`}>
                          <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
                        </div>
                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
                      </div>
                      <div className="space-y-0.5 sm:space-y-1">
                        <p className="text-xs text-muted-foreground sm:text-sm">{stat.title}</p>
                        <p className="text-xl font-bold text-foreground sm:text-2xl">
                          {stat.value}
                          <span className="ml-1 text-xs font-normal text-muted-foreground sm:text-sm">
                            {stat.unit}
                          </span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
              {/* Today's Study Plan */}
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 sm:pb-4">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold sm:text-lg">
                      <Calendar className="h-4 w-4 text-foreground sm:h-5 sm:w-5" />
                      {"Today's"} Study Plan
                    </CardTitle>
                    <Link href="/workspace">
                      <Button variant="ghost" size="sm" className="h-8 text-xs sm:text-sm">
                        View All <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    {upcomingTasks.map((task, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-muted/30 p-3 sm:p-4"
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div
                            className={`h-2 w-2 shrink-0 rounded-full ${
                              task.priority === "high"
                                ? "bg-red-500"
                                : task.priority === "medium"
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                            }`}
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground sm:text-base">
                              {task.title}
                            </p>
                            <p className="text-xs text-muted-foreground sm:text-sm">
                              {task.duration || "30 min"}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="h-8 shrink-0 gap-1.5 text-xs sm:gap-2 sm:text-sm">
                          <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">Start</span>
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card className="border-border/50">
                  <CardHeader className="pb-2 sm:pb-4">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold sm:text-lg">
                      <Clock className="h-4 w-4 text-foreground sm:h-5 sm:w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="shrink-0 rounded-lg bg-muted/50 p-2">
                          {activity.type === "quiz" && (
                            <Brain className="h-4 w-4 text-violet-500" />
                          )}
                          {activity.type === "upload" && (
                            <FileText className="h-4 w-4 text-blue-500" />
                          )}
                          {activity.type === "study" && (
                            <BookOpen className="h-4 w-4 text-emerald-500" />
                          )}
                          {activity.type === "plan" && (
                            <Calendar className="h-4 w-4 text-amber-500" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-foreground sm:text-sm">
                            {activity.title}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                        {activity.score && (
                          <span className="shrink-0 text-xs font-medium text-emerald-500 sm:text-sm">
                            {activity.score}
                          </span>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Subject Progress */}
            <motion.div
              className="mt-4 sm:mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="border-border/50">
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold sm:text-lg">
                    <Target className="h-4 w-4 text-foreground sm:h-5 sm:w-5" />
                    Subject Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                    {[
                      { name: "Physics", progress: 72 },
                      { name: "Chemistry", progress: 58 },
                      { name: "Mathematics", progress: 85 },
                      { name: "Biology", progress: 45 },
                      { name: "English", progress: 90 },
                      { name: "Computer Science", progress: 65 },
                    ].map((subject) => (
                      <div key={subject.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-foreground sm:text-sm">
                            {subject.name}
                          </span>
                          <span className="text-xs text-muted-foreground sm:text-sm">
                            {subject.progress}%
                          </span>
                        </div>
                        <Progress value={subject.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              className="mt-4 sm:mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Card className="border-border/50 bg-muted/30">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="text-base font-semibold text-foreground sm:text-lg">
                        Ready to continue learning?
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                        Pick up where you left off or explore new features
                      </p>
                    </div>
                    <div className="flex w-full gap-3 sm:w-auto">
                      <Link href="/features" className="flex-1 sm:flex-none">
                        <Button variant="outline" className="w-full text-xs sm:text-sm">
                          Explore Features
                        </Button>
                      </Link>
                      <Link href="/workspace" className="flex-1 sm:flex-none">
                        <Button className="w-full text-xs sm:text-sm">Continue Learning</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
