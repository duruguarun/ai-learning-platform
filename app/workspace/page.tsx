"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, MessageSquare, Lightbulb, X, ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { ConceptModule } from "@/components/modules/ConceptModule";
import { PYQModule } from "@/components/modules/PYQModule";
import { SyllabusModule } from "@/components/modules/SyllabusModule";
import { StudyPlanModule } from "@/components/modules/StudyPlanModule";
import { QuizModule } from "@/components/modules/QuizModule";
import { SimulationModule } from "@/components/modules/SimulationModule";
import { AIChatPanel } from "@/components/panels/AIChatPanel";
import { RecommendationPanel } from "@/components/panels/RecommendationPanel";
import { useAppStore } from "@/lib/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

// Module mapping based on feature parameter
const featureModules: Record<string, React.ComponentType> = {
  concept: ConceptModule,
  pyq: PYQModule,
  syllabus: SyllabusModule,
  studyplan: StudyPlanModule,
  quiz: QuizModule,
  simulation: SimulationModule,
};

const featureLabels: Record<string, string> = {
  concept: "Explain Concepts",
  pyq: "PYQ Analysis",
  syllabus: "Syllabus Parser",
  studyplan: "Study Plan Generator",
  quiz: "Practice Quiz",
  simulation: "Interactive Simulation",
};

function WorkspaceContent() {
  const searchParams = useSearchParams();
  const feature = searchParams.get("feature") || "concept";
  const setCurrentFeature = useAppStore((state) => state.setCurrentFeature);
  const [showAIPanel, setShowAIPanel] = useState(false);

  useEffect(() => {
    if (setCurrentFeature) setCurrentFeature(feature);
  }, [feature, setCurrentFeature]);

  // Get the appropriate module component
  const ModuleComponent = featureModules[feature] || ConceptModule;
  const featureLabel = featureLabels[feature] || "Feature";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      {/* Main Content */}
      <main className="flex flex-1 flex-col pt-14">
        {/* Mobile Header with Back Button */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
          <div className="flex items-center gap-3">
            <Link href="/features">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-sm font-semibold">{featureLabel}</h1>
          </div>
          
          {/* Mobile AI Chat Button */}
          <Sheet open={showAIPanel} onOpenChange={setShowAIPanel}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                AI Help
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full p-0 sm:w-96">
              <Tabs defaultValue="chat" className="flex h-full flex-col">
                <SheetHeader className="border-b border-border px-4 py-3">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-base">AI Assistant</SheetTitle>
                  </div>
                  <TabsList className="mt-2 w-full">
                    <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
                    <TabsTrigger value="tips" className="flex-1">Tips</TabsTrigger>
                  </TabsList>
                </SheetHeader>
                <TabsContent value="chat" className="m-0 flex-1 overflow-hidden p-0">
                  <AIChatPanel />
                </TabsContent>
                <TabsContent value="tips" className="m-0 flex-1 overflow-hidden p-0">
                  <RecommendationPanel feature={feature} />
                </TabsContent>
              </Tabs>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-1">
          {/* Module Content Area */}
          <div className="flex-1 overflow-auto">
            <motion.div
              key={feature}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 sm:p-6 lg:p-8"
            >
              {/* Desktop Feature Title */}
              <div className="mb-6 hidden items-center justify-between lg:flex">
                <div>
                  <Link href="/features" className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Features
                  </Link>
                  <h1 className="text-2xl font-bold">{featureLabel}</h1>
                </div>
              </div>
              
              <ModuleComponent />
            </motion.div>
          </div>

          {/* Desktop Right Panel - AI Chat & Recommendations */}
          <div className="hidden w-80 shrink-0 flex-col border-l border-border lg:flex xl:w-96">
            <Tabs defaultValue="chat" className="flex h-full flex-col">
              <div className="shrink-0 border-b border-border px-4 py-2">
                <TabsList className="w-full">
                  <TabsTrigger value="chat" className="flex-1 gap-2">
                    <MessageSquare className="h-4 w-4" />
                    AI Chat
                  </TabsTrigger>
                  <TabsTrigger value="tips" className="flex-1 gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Tips
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="chat" className="m-0 flex-1 overflow-hidden p-0">
                <AIChatPanel />
              </TabsContent>
              
              <TabsContent value="tips" className="m-0 flex-1 overflow-hidden p-0">
                <RecommendationPanel feature={feature} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-foreground" />
        </div>
      }
    >
      <WorkspaceContent />
    </Suspense>
  );
}
