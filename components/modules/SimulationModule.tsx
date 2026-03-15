"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayCircle, Pause, RotateCcw, ChevronRight,
  Atom, Binary, Cpu, Network, Layers,
  Sparkles, Loader2, VideoIcon, Download,
  Code2, AlertCircle, CheckCircle2, Clock,
  Zap, BookOpen, FlaskConical, Globe, BarChart3,
  X, RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store/useAppStore";
import { animationAPI } from "@/lib/services/api";

// ─────────────────────────────────────────────────────────────────────────────
// Existing simulations (UNTOUCHED)
// ─────────────────────────────────────────────────────────────────────────────
const simulations = [
  { id: "sorting",         title: "Sorting Algorithm Visualization", description: "Watch how different sorting algorithms work step by step", icon: Binary,  color: "bg-blue-500",   difficulty: "Beginner" },
  { id: "tree-traversal",  title: "Tree Traversal",                  description: "Visualize inorder, preorder, and postorder traversals",   icon: Network, color: "bg-green-500",  difficulty: "Intermediate" },
  { id: "neural-network",  title: "Neural Network Forward Pass",      description: "See how data flows through a neural network",             icon: Cpu,     color: "bg-purple-500", difficulty: "Advanced" },
  { id: "atomic-structure",title: "Atomic Structure",                 description: "Explore electron orbitals and atomic models",             icon: Atom,    color: "bg-orange-500", difficulty: "Intermediate" },
  { id: "stack-operations",title: "Stack Operations",                 description: "Push, pop, and peek operations visualized",               icon: Layers,  color: "bg-red-500",    difficulty: "Beginner" },
];

function SortingVisualization({ speed }: { speed: number }) {
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90, 45, 78, 33]);
  const [sorting, setSorting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const maxValue = Math.max(...array);

  const resetArray = () => {
    setArray([64, 34, 25, 12, 22, 11, 90, 45, 78, 33]);
    setSorting(false); setCurrentIndex(-1); setSortedIndices([]);
  };

  const startSort = async () => {
    setSorting(true);
    const arr = [...array];
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setCurrentIndex(j);
        await new Promise(r => setTimeout(r, 1000 / speed));
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
        }
      }
      setSortedIndices(prev => [...prev, n - i - 1]);
    }
    setSortedIndices(prev => [...prev, 0]);
    setSorting(false); setCurrentIndex(-1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-center gap-1 h-48">
        {array.map((value, index) => (
          <motion.div
            key={index}
            className={cn("w-8 rounded-t transition-colors",
              currentIndex === index || currentIndex === index + 1 ? "bg-yellow-500"
              : sortedIndices.includes(index) ? "bg-green-500" : "bg-primary"
            )}
            style={{ height: `${(value / maxValue) * 100}%` }}
            initial={false}
            animate={{ height: `${(value / maxValue) * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        ))}
      </div>
      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" size="icon" onClick={resetArray} disabled={sorting}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button onClick={sorting ? () => {} : startSort} disabled={sorting} className="gap-2">
          {sorting ? <><Pause className="h-4 w-4" />Sorting...</> : <><PlayCircle className="h-4 w-4" />Start Bubble Sort</>}
        </Button>
      </div>
      <div className="text-center text-sm text-muted-foreground">
        Bubble Sort compares adjacent elements and swaps them if they are in wrong order.
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AI Video Generator types
// ─────────────────────────────────────────────────────────────────────────────
type JobStatus = "idle" | "queued" | "generating" | "done" | "error";

interface Job {
  jobId:    string;
  topic:    string;
  status:   JobStatus;
  videoUrl: string | null;
  error:    string | null;
  code:     string | null;
}

const SUGGESTED_TOPICS = [
  { label: "How Rain Forms",           icon: Globe,       color: "text-blue-400" },
  { label: "Stack Push & Pop",         icon: Layers,      color: "text-red-400" },
  { label: "Photosynthesis",           icon: FlaskConical,color: "text-green-400" },
  { label: "Binary Search Tree",       icon: Network,     color: "text-purple-400" },
  { label: "Bubble Sort",              icon: Binary,      color: "text-yellow-400" },
  { label: "Newton's Laws of Motion",  icon: Zap,         color: "text-orange-400" },
  { label: "How the Internet Works",   icon: Globe,       color: "text-cyan-400" },
  { label: "Supply and Demand",        icon: BarChart3,   color: "text-pink-400" },
  { label: "Cell Division",            icon: Atom,        color: "text-teal-400" },
  { label: "Linked List",              icon: Cpu,         color: "text-indigo-400" },
  { label: "Electric Circuits",        icon: Zap,         color: "text-amber-400" },
  { label: "How Fractions Work",       icon: BookOpen,    color: "text-emerald-400" },
];

const STATUS_CONFIG: Record<JobStatus, { label: string; color: string; icon: React.FC<{ className?: string }> }> = {
  idle:       { label: "Ready",       color: "text-muted-foreground",  icon: Sparkles },
  queued:     { label: "Queued",      color: "text-yellow-500",        icon: Clock },
  generating: { label: "AI Writing Code…", color: "text-blue-500",    icon: Loader2 },
  done:       { label: "Video Ready", color: "text-green-500",         icon: CheckCircle2 },
  error:      { label: "Failed",      color: "text-destructive",       icon: AlertCircle },
};

// ─────────────────────────────────────────────────────────────────────────────
// AI Video Generator component
// ─────────────────────────────────────────────────────────────────────────────
function AIVideoGenerator() {
  const [topic, setTopic]             = useState("");
  const [job, setJob]                 = useState<Job | null>(null);
  const [apiOnline, setApiOnline]     = useState<boolean | null>(null);
  const [showCode, setShowCode]       = useState(false);
  const pollRef                       = useRef<ReturnType<typeof setInterval> | null>(null);
  const { addWorkflowStep }           = useAppStore();

  // Check API health on mount
  useEffect(() => {
    animationAPI.health().then(setApiOnline);
  }, []);

  // Poll job status while in progress
  useEffect(() => {
    if (!job || job.status === "done" || job.status === "error" || job.status === "idle") {
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
      return;
    }

    pollRef.current = setInterval(async () => {
      try {
        const s = await animationAPI.getStatus(job.jobId);
        setJob(prev => prev ? {
          ...prev,
          status:   s.status as JobStatus,
          videoUrl: s.video_url ? animationAPI.getVideoUrl(job.jobId) : null,
          error:    s.error,
          code:     s.code,
        } : null);
      } catch (e) {
        console.error("polling error:", e);
      }
    }, 3000);

    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [job?.jobId, job?.status]);

  const handleGenerate = async (t?: string) => {
    const finalTopic = (t ?? topic).trim();
    if (!finalTopic) return;

    setJob({ jobId: "", topic: finalTopic, status: "queued", videoUrl: null, error: null, code: null });

    addWorkflowStep({
      id:     `animation-${Date.now()}`,
      title:  `Animate: ${finalTopic}`,
      type:   "simulation",
      status: "active",
    });

    try {
      const res = await animationAPI.generate(finalTopic);
      setJob({ jobId: res.job_id, topic: finalTopic, status: "queued",
               videoUrl: null, error: null, code: null });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to start job";
      setJob({ jobId: "", topic: finalTopic, status: "error",
               videoUrl: null, error: msg, code: null });
    }
  };

  const handleReset = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    setJob(null); setTopic(""); setShowCode(false);
  };

  const cfg = STATUS_CONFIG[job?.status ?? "idle"];

  return (
    <div className="space-y-5">
      {/* API status banner */}
      {apiOnline === false && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
          <div className="text-sm">
            <span className="font-medium text-destructive">API Offline</span>
            <span className="ml-2 text-muted-foreground">
              Start the backend: <code className="rounded bg-muted px-1 text-xs">cd manim-animator && uvicorn main:app --port 8001</code>
            </span>
          </div>
        </motion.div>
      )}

      {/* Input area */}
      {!job && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <VideoIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter any topic to animate…"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleGenerate()}
                    className="pl-9"
                    disabled={apiOnline === false}
                  />
                </div>
                <Button
                  onClick={() => handleGenerate()}
                  disabled={!topic.trim() || apiOnline === false}
                  className="gap-2 shrink-0"
                >
                  <Sparkles className="h-4 w-4" />
                  Generate
                </Button>
              </div>

              {/* Suggested topics */}
              <div>
                <p className="mb-2.5 text-xs text-muted-foreground font-medium tracking-wide uppercase">
                  Suggested topics
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_TOPICS.map(({ label, icon: Icon, color }) => (
                    <button
                      key={label}
                      onClick={() => handleGenerate(label)}
                      disabled={apiOnline === false}
                      className="flex items-center gap-1.5 rounded-full border border-border bg-muted/50
                                 px-3 py-1 text-xs font-medium transition-all
                                 hover:border-primary hover:bg-accent hover:text-accent-foreground
                                 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Icon className={cn("h-3 w-3", color)} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info card */}
          <Card className="border-dashed bg-muted/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">How it works</p>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Type any topic — for a school kid or a PhD student. The AI writes Manim animation
                    code, renders a ~60 second educational video, and streams it here. Takes 1–3 minutes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Job in progress / done / error */}
      <AnimatePresence mode="wait">
        {job && (
          <motion.div
            key={job.jobId + job.status}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            {/* Status card */}
            <Card className={cn(
              "border-2 transition-colors",
              job.status === "done"  && "border-green-500/40 bg-green-500/5",
              job.status === "error" && "border-destructive/40 bg-destructive/5",
              (job.status === "queued" || job.status === "generating") && "border-blue-500/30 bg-blue-500/5",
            )}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                      job.status === "done"  ? "bg-green-500/20"      :
                      job.status === "error" ? "bg-destructive/20"    : "bg-blue-500/20"
                    )}>
                      <cfg.icon className={cn(
                        "h-5 w-5",
                        cfg.color,
                        (job.status === "queued" || job.status === "generating") && "animate-spin"
                      )} />
                    </div>
                    <div className="min-w-0">
                      <p className={cn("text-sm font-semibold", cfg.color)}>{cfg.label}</p>
                      <p className="truncate text-xs text-muted-foreground">{job.topic}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleReset} className="shrink-0 h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Progress dots while waiting */}
                {(job.status === "queued" || job.status === "generating") && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex gap-1">
                        {[0.0, 0.2, 0.4].map(delay => (
                          <motion.span
                            key={delay}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay }}
                            className="block h-1.5 w-1.5 rounded-full bg-blue-400"
                          />
                        ))}
                      </div>
                      <span>
                        {job.status === "queued" ? "Waiting in queue…" : "AI is writing Manim code and rendering video…"}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground/60">
                      This usually takes 1–3 minutes. You can keep using the app while waiting.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ── Video player ────────────────────────────────── */}
            {job.status === "done" && job.videoUrl && (
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <VideoIcon className="h-4 w-4 text-primary" />
                        {job.topic}
                      </CardTitle>
                      <div className="flex gap-2">
                        <a href={job.videoUrl} download={`${job.topic}.mp4`} target="_blank" rel="noreferrer">
                          <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs">
                            <Download className="h-3 w-3" />
                            Download
                          </Button>
                        </a>
                        <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs"
                                onClick={() => setShowCode(!showCode)}>
                          <Code2 className="h-3 w-3" />
                          {showCode ? "Hide" : "Code"}
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs" onClick={handleReset}>
                          <RefreshCw className="h-3 w-3" />
                          New
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Video */}
                    <div className="overflow-hidden rounded-lg border border-border bg-black">
                      <video
                        key={job.videoUrl}
                        controls
                        autoPlay
                        className="w-full"
                        style={{ maxHeight: "380px" }}
                      >
                        <source src={job.videoUrl} type="video/mp4" />
                        Your browser does not support the video element.
                      </video>
                    </div>

                    {/* Generated code */}
                    <AnimatePresence>
                      {showCode && job.code && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="rounded-lg border border-border bg-muted/50">
                            <div className="flex items-center justify-between border-b border-border px-4 py-2">
                              <span className="flex items-center gap-2 text-xs font-medium">
                                <Code2 className="h-3.5 w-3.5" />
                                Generated Manim Code
                              </span>
                              <Badge variant="secondary" className="text-[10px]">Python</Badge>
                            </div>
                            <pre className="overflow-auto p-4 text-[11px] leading-relaxed text-muted-foreground max-h-72">
                              <code>{job.code}</code>
                            </pre>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* ── Error state ─────────────────────────────────── */}
            {job.status === "error" && (
              <Card className="border-destructive/30">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-4 w-4 shrink-0 text-destructive mt-0.5" />
                    <div className="space-y-2 min-w-0">
                      <p className="text-sm font-medium text-destructive">Animation generation failed</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {job.error || "An unexpected error occurred."}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleGenerate(job.topic)} className="gap-1.5">
                      <RefreshCw className="h-3 w-3" />
                      Retry
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleReset}>
                      Try Different Topic
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export — adds AI Video tab alongside existing Simulations tab
// ─────────────────────────────────────────────────────────────────────────────
export function SimulationModule() {
  const [selectedSimulation, setSelectedSimulation] = useState<string | null>(null);
  const [speed, setSpeed] = useState([5]);
  const { addWorkflowStep } = useAppStore();

  const handleSelectSimulation = (simId: string) => {
    setSelectedSimulation(simId);
    addWorkflowStep({
      id:     `simulation-${Date.now()}`,
      title:  `Simulation: ${simulations.find(s => s.id === simId)?.title}`,
      type:   "simulation",
      status: "active",
    });
  };

  const selectedSim = simulations.find(s => s.id === selectedSimulation);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500">
          <PlayCircle className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Simulations & Animations</h2>
          <p className="text-sm text-muted-foreground">
            Interactive simulations + AI-generated video explanations
          </p>
        </div>
      </div>

      <Tabs defaultValue="interactive">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="interactive" className="gap-2">
            <PlayCircle className="h-4 w-4" />
            Interactive
          </TabsTrigger>
          <TabsTrigger value="ai-video" className="gap-2">
            <Sparkles className="h-4 w-4" />
            AI Video
            <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">New</Badge>
          </TabsTrigger>
        </TabsList>

        {/* ── Existing interactive simulations (completely untouched) ── */}
        <TabsContent value="interactive" className="mt-6">
          {!selectedSimulation && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {simulations.map((sim) => (
                <motion.div key={sim.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
                        onClick={() => handleSelectSimulation(sim.id)}>
                    <CardHeader className="pb-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${sim.color}`}>
                        <sim.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="mt-4 text-base">{sim.title}</CardTitle>
                      <CardDescription className="line-clamp-2 text-xs">{sim.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">{sim.difficulty}</Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {selectedSimulation && selectedSim && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${selectedSim.color}`}>
                        <selectedSim.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle>{selectedSim.title}</CardTitle>
                        <CardDescription>{selectedSim.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline">{selectedSim.difficulty}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">Speed:</span>
                    <Slider value={speed} onValueChange={setSpeed} min={1} max={10} step={1} className="w-32" />
                    <span className="text-sm font-medium">{speed[0]}x</span>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-6">
                    {selectedSimulation === "sorting" && <SortingVisualization speed={speed[0]} />}
                    {selectedSimulation !== "sorting" && (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className={`flex h-20 w-20 items-center justify-center rounded-full ${selectedSim.color}/20`}>
                          <selectedSim.icon className={`h-10 w-10 ${selectedSim.color.replace("bg-", "text-")}`} />
                        </div>
                        <h3 className="mt-4 text-lg font-medium">{selectedSim.title}</h3>
                        <p className="mt-2 text-center text-sm text-muted-foreground">
                          Interactive visualization of {selectedSim.title.toLowerCase()}.
                        </p>
                        <Button className="mt-4 gap-2"><PlayCircle className="h-4 w-4" />Start Simulation</Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Button variant="outline" onClick={() => setSelectedSimulation(null)}>
                Back to Simulations
              </Button>
            </motion.div>
          )}
        </TabsContent>

        {/* ── AI Video Generator ── */}
        <TabsContent value="ai-video" className="mt-6">
          <AIVideoGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SimulationModule;
