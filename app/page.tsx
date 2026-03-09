"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  BookOpen,
  Upload,
  Brain,
  FileText,
  Calendar,
  HelpCircle,
  Play,
  ArrowRight,
  Check,
  ChevronRight,
  Sparkles,
  Target,
  TrendingUp,
  Clock,
  Zap,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const workflowSteps = [
  {
    step: "01",
    title: "Upload Your Materials",
    description: "Drop your PDFs, notes, textbooks, or syllabi. Our AI instantly processes and understands your content.",
    icon: Upload,
  },
  {
    step: "02",
    title: "AI Analyzes Everything",
    description: "Extracts key concepts, maps to syllabus, identifies important topics from previous year questions.",
    icon: Brain,
  },
  {
    step: "03",
    title: "Get Your Study Plan",
    description: "Receive a personalized day-by-day schedule optimized for your exam date and learning pace.",
    icon: Calendar,
  },
  {
    step: "04",
    title: "Learn & Practice",
    description: "Study with AI explanations, take adaptive quizzes, and simulate real exams to track progress.",
    icon: Target,
  },
];

const features = [
  {
    icon: FileText,
    title: "Concept Extraction",
    description: "AI breaks down complex topics into digestible explanations with visual diagrams and real-world examples.",
  },
  {
    icon: TrendingUp,
    title: "PYQ Pattern Analysis",
    description: "Analyze 10+ years of previous questions. Know exactly what topics appear most frequently.",
  },
  {
    icon: Calendar,
    title: "Smart Study Planner",
    description: "AI creates week-by-week schedules that adapt as you progress. Never miss important topics.",
  },
  {
    icon: HelpCircle,
    title: "Adaptive Quizzes",
    description: "Practice with AI-generated questions that match your exam pattern. Instant feedback on every answer.",
  },
  {
    icon: Play,
    title: "Exam Simulation",
    description: "Full-length mock tests in real exam conditions. Get detailed performance analytics after each attempt.",
  },
  {
    icon: MessageSquare,
    title: "24/7 AI Tutor",
    description: "Stuck on a problem? Ask your AI tutor anytime. Get step-by-step solutions and explanations.",
  },
];

const stats = [
  { value: "10K+", label: "Active Students" },
  { value: "95%", label: "Pass Rate" },
  { value: "500+", label: "Subjects Covered" },
  { value: "24/7", label: "AI Support" },
];

const testimonials = [
  {
    quote: "LearnFlow's PYQ analysis helped me identify exactly what to focus on. I improved my score by 40% in just 2 months.",
    name: "Priya Sharma",
    role: "JEE Advanced 2024",
  },
  {
    quote: "The AI-generated study plan kept me on track throughout my preparation. Best investment for my education.",
    name: "Rahul Verma",
    role: "NEET Aspirant",
  },
  {
    quote: "I used to waste hours figuring out what to study. Now the AI tells me exactly what I need each day.",
    name: "Ananya Patel",
    role: "UPSC Preparation",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-black">LearnFlow</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="#how-it-works" className="text-sm font-medium text-black/70 transition-colors hover:text-black">
              How It Works
            </Link>
            <Link href="#features" className="text-sm font-medium text-black/70 transition-colors hover:text-black">
              Features
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-black/70 transition-colors hover:text-black">
              Reviews
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-black hover:bg-black/5">Sign In</Button>
            </Link>
            <Link href="/login?mode=signup">
              <Button className="bg-black text-white hover:bg-black/90">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/20 bg-black/5 px-4 py-1.5 text-sm font-medium text-black">
                <Sparkles className="h-4 w-4" />
                <span>AI-Powered Study Assistant</span>
              </div>
              <h1 className="text-balance text-4xl font-bold tracking-tight text-black sm:text-5xl lg:text-6xl">
                Stop Studying Hard.
                <br />
                <span className="text-black/60">Start Studying Smart.</span>
              </h1>
              <p className="mt-6 max-w-xl text-pretty text-lg text-black/70">
                Upload your notes, syllabus, and past papers. Our AI creates a personalized study plan, 
                explains concepts, generates practice questions, and tracks your progress to exam success.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/onboarding">
                  <Button size="lg" className="w-full gap-2 bg-black text-base text-white hover:bg-black/90 sm:w-auto">
                    Start Learning Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button variant="outline" size="lg" className="w-full border-black/20 text-base text-black hover:bg-black/5 sm:w-auto">
                    See How It Works
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-black/60">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-black" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-black" />
                  <span>Free forever plan</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-black/10">
                <Image
                  src="/images/hero-student.jpg"
                  alt="Student studying with LearnFlow"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              {/* Floating Cards */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -left-4 bottom-8 rounded-lg border border-black/10 bg-white p-4 shadow-xl sm:-left-8"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">Study Plan Ready</p>
                    <p className="text-xs text-black/60">28 days to your exam</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="absolute -right-4 top-8 rounded-lg border border-black/10 bg-white p-4 shadow-xl sm:-right-8"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/10">
                    <TrendingUp className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">+40% Score</p>
                    <p className="text-xs text-black/60">Average improvement</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-black/10 bg-black py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl font-bold text-white sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-white/60">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-black/60">Simple Process</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-black sm:text-4xl">
              How LearnFlow Works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-black/70">
              From upload to exam success in 4 simple steps. Our AI handles the complexity so you can focus on learning.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {index < workflowSteps.length - 1 && (
                  <div className="absolute right-0 top-12 hidden h-0.5 w-full bg-black/10 lg:block" style={{ left: '60%', width: '80%' }} />
                )}
                <div className="relative rounded-2xl border border-black/10 bg-white p-6 transition-shadow hover:shadow-lg">
                  <span className="text-5xl font-bold text-black/10">{step.step}</span>
                  <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-black">
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-black">{step.title}</h3>
                  <p className="mt-2 text-sm text-black/60">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Image */}
      <section id="features" className="border-t border-black/10 bg-black/[0.02] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-semibold uppercase tracking-wider text-black/60">Powerful Features</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-black sm:text-4xl">
                Everything You Need to Ace Your Exams
              </h2>
              <p className="mt-4 text-black/70">
                Our AI-powered platform combines multiple learning tools into one seamless experience, 
                designed specifically for competitive exam preparation.
              </p>

              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black transition-transform group-hover:scale-110">
                        <feature.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-black">{feature.title}</h3>
                        <p className="mt-1 text-sm text-black/60">{feature.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-black/10">
                <Image
                  src="/images/ai-learning.jpg"
                  alt="AI-powered learning visualization"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-xl border border-black/10 bg-white p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/10">
                    <Clock className="h-7 w-7 text-black" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-black">3.5 hrs</p>
                    <p className="text-sm text-black/60">Avg. daily saved</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Visual Showcase */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-black/60">Built For Students</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-black sm:text-4xl">
              Study Smarter, Together
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-black/10"
            >
              <Image
                src="/images/study-plan.jpg"
                alt="Organized study planning"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-xl font-bold text-white">Personalized Study Plans</h3>
                <p className="mt-2 text-sm text-white/80">
                  AI creates day-by-day schedules based on your exam date, syllabus, and learning speed.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-black/10"
            >
              <Image
                src="/images/quiz-practice.jpg"
                alt="Practice quizzes and exams"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-xl font-bold text-white">Practice Like The Real Exam</h3>
                <p className="mt-2 text-sm text-white/80">
                  AI-generated questions that match your exam pattern. Timed tests with instant feedback.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="border-t border-black/10 bg-black/[0.02] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-black/60">Student Success Stories</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-black sm:text-4xl">
              Loved by Students Across India
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 grid gap-6 md:grid-cols-3"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="rounded-2xl border border-black/10 bg-white p-6"
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 fill-black" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-4 text-black/80">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-black">{testimonial.name}</p>
                    <p className="text-sm text-black/60">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-black py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Your Next Exam Starts Here
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
              Join thousands of students who are already learning smarter. 
              Upload your first document and get your personalized study plan in minutes.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/onboarding">
                <Button size="lg" className="w-full gap-2 bg-white text-base text-black hover:bg-white/90 sm:w-auto">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full border-white/20 text-base text-white hover:bg-white/10 sm:w-auto">
                  Sign In
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-white/50">
              Free plan includes: 5 documents, unlimited quizzes, basic study plans
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-black">LearnFlow</span>
            </div>
            <nav className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="#how-it-works" className="text-black/60 transition-colors hover:text-black">How It Works</Link>
              <Link href="#features" className="text-black/60 transition-colors hover:text-black">Features</Link>
              <Link href="#testimonials" className="text-black/60 transition-colors hover:text-black">Reviews</Link>
              <Link href="/login" className="text-black/60 transition-colors hover:text-black">Sign In</Link>
            </nav>
            <p className="text-sm text-black/50">
              Built with AI for students, by students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
