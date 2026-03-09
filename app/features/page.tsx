"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Lightbulb,
  FileSearch,
  FileText,
  Calendar,
  HelpCircle,
  PlayCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { useAppStore } from "@/lib/store/useAppStore";

const features = [
  {
    id: "concept",
    title: "Explain Concepts",
    description: "Get AI-powered explanations for any topic with visual aids, diagrams, and real-world examples",
    icon: Lightbulb,
    color: "bg-blue-500/10 text-blue-600",
    iconBg: "bg-blue-500",
    badge: "Popular",
  },
  {
    id: "pyq",
    title: "Analyze PYQ Papers",
    description: "Upload previous year questions and get pattern analysis, topic frequency, and exam predictions",
    icon: FileSearch,
    color: "bg-purple-500/10 text-purple-600",
    iconBg: "bg-purple-500",
    badge: "Recommended",
  },
  {
    id: "syllabus",
    title: "Upload Syllabus",
    description: "Parse your syllabus to extract units, topics, and generate structured learning objectives",
    icon: FileText,
    color: "bg-green-500/10 text-green-600",
    iconBg: "bg-green-500",
  },
  {
    id: "studyplan",
    title: "Generate Study Plan",
    description: "Create personalized weekly study schedules based on your goals, syllabus, and exam dates",
    icon: Calendar,
    color: "bg-orange-500/10 text-orange-600",
    iconBg: "bg-orange-500",
  },
  {
    id: "quiz",
    title: "Practice Quiz",
    description: "Test your knowledge with AI-generated quizzes and get instant feedback with explanations",
    icon: HelpCircle,
    color: "bg-red-500/10 text-red-600",
    iconBg: "bg-red-500",
    badge: "New",
  },
  {
    id: "simulation",
    title: "Interactive Simulation",
    description: "Learn complex concepts through interactive visualizations and step-by-step simulations",
    icon: PlayCircle,
    color: "bg-indigo-500/10 text-indigo-600",
    iconBg: "bg-indigo-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function FeatureHubPage() {
  const { user, setCurrentFeature } = useAppStore();

  const handleFeatureClick = (featureId: string) => {
    setCurrentFeature(featureId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Learning Tools</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome{user ? `, ${user.name.split(" ")[0]}` : ""}!
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Choose a feature to start your learning journey. Each tool is designed to help you learn more effectively.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div key={feature.id} variants={itemVariants}>
              <Link
                href={`/workspace?feature=${feature.id}`}
                onClick={() => handleFeatureClick(feature.id)}
              >
                <Card className="group h-full cursor-pointer transition-all hover:border-primary hover:shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${feature.iconBg}`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      {feature.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {feature.badge}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="mt-4 flex items-center gap-2 transition-colors group-hover:text-primary">
                      {feature.title}
                      <ArrowRight className="h-4 w-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="secondary" className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 rounded-xl border border-border bg-muted/30 p-6"
        >
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Continue where you left off or explore new features
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                View Dashboard
              </Button>
            </Link>
            <Link href="/library">
              <Button variant="outline" size="sm">
                Browse Library
              </Button>
            </Link>
            <Link href="/workspace?feature=concept">
              <Button variant="outline" size="sm">
                Quick Concept Search
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
