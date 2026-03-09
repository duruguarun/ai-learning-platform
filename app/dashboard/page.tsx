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
import { Sidebar } from "@/components/layout/Sidebar";
import Link from "next/link";

export default function DashboardPage() {
  const { user, studyPlan, documents, fetchDashboardData, setActivePage } = useAppStore();

  useEffect(() => {
    setActivePage("dashboard");
    fetchDashboardData();
  }, [fetchDashboardData, setActivePage]);

  const stats = [
    {
      title: "Study Streak",
      value: user?.studyStreak || 0,
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
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, {user?.name || "Student"}
              </h1>
              <p className="text-muted-foreground">
                {"Here's"} your learning progress for today. Keep up the great work!
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border-border/50 hover:border-primary/30 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl ${stat.bg}`}>
                          <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold text-foreground">
                          {stat.value}
                          <span className="text-sm font-normal text-muted-foreground ml-1">
                            {stat.unit}
                          </span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Study Plan */}
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      {"Today's"} Study Plan
                    </CardTitle>
                    <Link href="/workspace">
                      <Button variant="ghost" size="sm" className="text-primary">
                        View All <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {upcomingTasks.map((task, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              task.priority === "high"
                                ? "bg-red-500"
                                : task.priority === "medium"
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                            }`}
                          />
                          <div>
                            <p className="font-medium text-foreground">{task.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {task.duration || "30 min"}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="gap-2">
                          <Play className="h-4 w-4" /> Start
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
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-muted/50">
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
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {activity.title}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                        {activity.score && (
                          <span className="text-sm font-medium text-emerald-500">
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
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Subject Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { name: "Physics", progress: 72, color: "bg-blue-500" },
                      { name: "Chemistry", progress: 58, color: "bg-emerald-500" },
                      { name: "Mathematics", progress: 85, color: "bg-violet-500" },
                      { name: "Biology", progress: 45, color: "bg-amber-500" },
                      { name: "English", progress: 90, color: "bg-rose-500" },
                      { name: "Computer Science", progress: 65, color: "bg-cyan-500" },
                    ].map((subject) => (
                      <div key={subject.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">
                            {subject.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
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
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Card className="border-border/50 bg-gradient-to-r from-primary/5 to-violet-500/5">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        Ready to continue learning?
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Pick up where you left off or explore new features
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Link href="/features">
                        <Button variant="outline">Explore Features</Button>
                      </Link>
                      <Link href="/workspace">
                        <Button>Continue Learning</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
