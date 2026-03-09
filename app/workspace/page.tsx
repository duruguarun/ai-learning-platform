"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { WorkflowBuilder } from "@/components/workflow/WorkflowBuilder";
import { ContentViewer } from "@/components/panels/ContentViewer";
import { AIChatPanel } from "@/components/panels/AIChatPanel";
import { RecommendationPanel } from "@/components/panels/RecommendationPanel";
import { ConceptModule } from "@/components/modules/ConceptModule";
import { PYQModule } from "@/components/modules/PYQModule";
import { SyllabusModule } from "@/components/modules/SyllabusModule";
import { StudyPlanModule } from "@/components/modules/StudyPlanModule";
import { QuizModule } from "@/components/modules/QuizModule";
import { SimulationModule } from "@/components/modules/SimulationModule";
import { useAppStore } from "@/lib/store/useAppStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const { setCurrentFeature, currentContent } = useAppStore();

  useEffect(() => {
    setCurrentFeature(feature);
  }, [feature, setCurrentFeature]);

  // Get the appropriate module component
  const ModuleComponent = featureModules[feature] || ConceptModule;
  const featureLabel = featureLabels[feature] || "Feature";

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with Workflow */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
          {/* Left Panel - Workflow Builder */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden w-64 shrink-0 border-r border-border bg-muted/30 xl:block"
          >
            <WorkflowBuilder feature={feature} />
          </motion.div>

          {/* Center Panel - Module + Content Viewer */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <Tabs defaultValue="module" className="flex h-full flex-col">
              <div className="shrink-0 border-b border-border bg-background px-4">
                <TabsList className="h-12">
                  <TabsTrigger value="module" className="data-[state=active]:bg-background">
                    {featureLabel}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="content" 
                    className="data-[state=active]:bg-background"
                    disabled={!currentContent}
                  >
                    Content Viewer
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="module" className="flex-1 overflow-auto m-0 p-0">
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full p-6"
                >
                  <ModuleComponent />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="content" className="flex-1 overflow-auto m-0 p-0">
                <ContentViewer />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Panel - AI Chat & Recommendations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden w-80 shrink-0 flex-col border-l border-border lg:flex"
          >
            <Tabs defaultValue="chat" className="flex h-full flex-col">
              <div className="shrink-0 border-b border-border px-4">
                <TabsList className="h-12 w-full">
                  <TabsTrigger value="chat" className="flex-1 data-[state=active]:bg-background">
                    AI Chat
                  </TabsTrigger>
                  <TabsTrigger value="recommendations" className="flex-1 data-[state=active]:bg-background">
                    Tips
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="chat" className="flex-1 overflow-hidden m-0 p-0">
                <AIChatPanel />
              </TabsContent>
              
              <TabsContent value="recommendations" className="flex-1 overflow-hidden m-0 p-0">
                <RecommendationPanel feature={feature} />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <WorkspaceContent />
    </Suspense>
  );
}
