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
    description: "Get AI-powered explanations for any topic with visual aids and examples",
    icon: Lightbulb,
    iconBg: "bg-blue-500",
    badge: "Popular",
  },
  {
    id: "pyq",
    title: "Analyze PYQ Papers",
    description: "Upload previous year questions and get pattern analysis and predictions",
    icon: FileSearch,
    iconBg: "bg-violet-500",
    badge: "Recommended",
  },
  {
    id: "syllabus",
    title: "Upload Syllabus",
    description: "Parse your syllabus to extract units and generate learning objectives",
    icon: FileText,
    iconBg: "bg-emerald-500",
  },
  {
    id: "studyplan",
    title: "Generate Study Plan",
    description: "Create personalized weekly study schedules based on your goals",
    icon: Calendar,
    iconBg: "bg-amber-500",
  },
  {
    id: "quiz",
    title: "Practice Quiz",
    description: "Test your knowledge with AI-generated quizzes and instant feedback",
    icon: HelpCircle,
    iconBg: "bg-red-500",
    badge: "New",
  },
  {
    id: "simulation",
    title: "Interactive Simulation",
    description: "Learn complex concepts through interactive visualizations",
    icon: PlayCircle,
    iconBg: "bg-cyan-500",
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
  const user = useAppStore((state) => state.user);
  const setCurrentFeature = useAppStore((state) => state.setCurrentFeature);

  const handleFeatureClick = (featureId: string) => {
    if (setCurrentFeature) setCurrentFeature(featureId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="px-4 pb-8 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 sm:mb-12"
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Learning Tools</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Welcome{user ? `, ${user.name?.split(" ")[0]}` : ""}!
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base lg:text-lg">
              Choose a feature to start your learning journey
            </p>
          </motion.div>

          {/* Feature Cards Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
          >
            {features.map((feature) => (
              <motion.div key={feature.id} variants={itemVariants}>
                <Link
                  href={`/workspace?feature=${feature.id}`}
                  onClick={() => handleFeatureClick(feature.id)}
                >
                  <Card className="group h-full cursor-pointer border-border/50 transition-all hover:border-foreground/20 hover:shadow-lg">
                    <CardHeader className="pb-3 sm:pb-4">
                      <div className="flex items-start justify-between">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg sm:h-12 sm:w-12 ${feature.iconBg}`}>
                          <feature.icon className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                        </div>
                        {feature.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {feature.badge}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="mt-3 flex items-center gap-2 text-base transition-colors group-hover:text-foreground sm:mt-4 sm:text-lg">
                        {feature.title}
                        <ArrowRight className="h-4 w-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-xs sm:text-sm">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button variant="secondary" size="sm" className="w-full gap-2 text-xs transition-colors group-hover:bg-foreground group-hover:text-background sm:text-sm">
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
            className="mt-8 rounded-xl border border-border bg-muted/30 p-4 sm:mt-12 sm:p-6"
          >
            <h2 className="text-base font-semibold sm:text-lg">Quick Actions</h2>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Continue where you left off or explore new features
            </p>
            <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  View Dashboard
                </Button>
              </Link>
              <Link href="/library">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  Browse Library
                </Button>
              </Link>
              <Link href="/workspace?feature=concept">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  Quick Concept Search
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
