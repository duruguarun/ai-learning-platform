"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Lightbulb,
  FileSearch,
  Calendar,
  HelpCircle,
  PlayCircle,
  ArrowRight,
  Check,
  Sparkles,
  Brain,
  Target,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Lightbulb,
    title: "AI Concept Explanations",
    description: "Get detailed explanations with visual aids and real-world examples",
  },
  {
    icon: FileSearch,
    title: "PYQ Analysis",
    description: "Analyze previous year questions to identify important topics and patterns",
  },
  {
    icon: Calendar,
    title: "Smart Study Plans",
    description: "Personalized weekly schedules based on your goals and learning pace",
  },
  {
    icon: HelpCircle,
    title: "Practice Quizzes",
    description: "AI-generated quizzes with instant feedback and explanations",
  },
  {
    icon: PlayCircle,
    title: "Interactive Simulations",
    description: "Learn complex concepts through interactive visualizations",
  },
  {
    icon: Brain,
    title: "AI Tutor Chat",
    description: "24/7 AI assistant to answer your questions and guide your learning",
  },
];

const benefits = [
  "Personalized learning paths tailored to your needs",
  "AI-powered analysis of exam patterns",
  "Interactive content that adapts to your style",
  "Track your progress with detailed analytics",
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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">LearnAI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/login?mode=signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>AI-Powered Learning Platform</span>
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Master Any Subject with
              <span className="text-primary"> AI-Powered</span> Learning
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
              Upload your study materials, analyze exam patterns, and get personalized study plans. 
              Our AI tutor helps you learn smarter, not harder.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/login?mode=signup">
                <Button size="lg" className="gap-2 text-base">
                  Start Learning Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="text-base">
                  See How It Works
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Image/Illustration Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-16 rounded-xl border border-border bg-gradient-to-b from-muted/50 to-muted p-2"
          >
            <div className="aspect-[16/9] w-full rounded-lg bg-muted/50 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-4 p-8 opacity-80">
                {[Target, Brain, Zap].map((Icon, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 rounded-lg bg-background p-6 shadow-sm">
                    <Icon className="h-8 w-8 text-primary" />
                    <div className="h-2 w-16 rounded-full bg-muted" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-border bg-muted/30 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need to Excel
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Our AI-powered platform provides all the tools you need to master any subject efficiently.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="flex flex-col p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Learn Smarter with AI That Understands You
              </h2>
              <p className="mt-4 text-muted-foreground">
                Our platform adapts to your learning style, pace, and goals to provide 
                a truly personalized educational experience.
              </p>
              <ul className="mt-8 space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span>{benefit}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-10">
                <Link href="/login?mode=signup">
                  <Button size="lg" className="gap-2">
                    Get Started Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl border border-border bg-gradient-to-br from-muted to-muted/50 p-8">
                <div className="grid h-full grid-cols-2 gap-4">
                  <div className="rounded-lg bg-background p-4 shadow-sm">
                    <div className="mb-2 h-3 w-3/4 rounded bg-muted" />
                    <div className="h-2 w-full rounded bg-muted" />
                    <div className="mt-4 h-20 w-full rounded bg-primary/10" />
                  </div>
                  <div className="rounded-lg bg-background p-4 shadow-sm">
                    <div className="mb-2 h-3 w-1/2 rounded bg-muted" />
                    <div className="space-y-2">
                      <div className="h-2 w-full rounded bg-muted" />
                      <div className="h-2 w-4/5 rounded bg-muted" />
                      <div className="h-2 w-3/5 rounded bg-muted" />
                    </div>
                  </div>
                  <div className="col-span-2 rounded-lg bg-background p-4 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/20" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-1/3 rounded bg-muted" />
                        <div className="h-2 w-2/3 rounded bg-muted" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Transform Your Learning?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Join thousands of students who are already learning smarter with LearnAI.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/login?mode=signup">
                <Button size="lg" className="gap-2 text-base">
                  Start Learning Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <BookOpen className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">LearnAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with AI to help you learn better.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
