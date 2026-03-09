"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileSearch, Loader2, TrendingUp, BarChart3, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileUploadModule } from "./FileUploadModule";
import { useAppStore } from "@/lib/store/useAppStore";
import { pyqAPI } from "@/lib/services/api";
import { mockPYQAnalysis } from "@/lib/mock/mockData";

export function PYQModule() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<typeof mockPYQAnalysis | null>(null);
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);

  const { addGeneratedContent, addWorkflowStep } = useAppStore();

  const handleFileUpload = async (fileData: { id: string; name: string }) => {
    setUploadedFileId(fileData.id);
  };

  const handleAnalyze = async () => {
    if (!uploadedFileId) return;

    setIsAnalyzing(true);

    // Add workflow step
    addWorkflowStep({
      id: `pyq-${Date.now()}`,
      title: "PYQ Analysis",
      type: "pyq",
      status: "active",
    });

    try {
      const response = await pyqAPI.analyzePYQ(uploadedFileId);
      
      if (response.success) {
        setAnalysis(response.data);
        
        addGeneratedContent({
          type: "pyq-analysis",
          title: "PYQ Analysis Results",
          content: response.data,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Failed to analyze PYQ:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-green-600 bg-green-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500">
            <FileSearch className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Analyze PYQ Papers</h2>
            <p className="text-sm text-muted-foreground">
              Upload previous year questions to identify patterns and important topics
            </p>
          </div>
        </div>
      </div>

      {/* File Upload */}
      {!analysis && (
        <Card>
          <CardContent className="p-6">
            <FileUploadModule
              title="Upload PYQ Papers"
              description="Upload PDF or image files of previous year question papers"
              acceptedTypes={["application/pdf", "image/*"]}
              onUploadComplete={handleFileUpload}
            />
            
            {uploadedFileId && (
              <div className="mt-4">
                <Button 
                  onClick={handleAnalyze} 
                  disabled={isAnalyzing}
                  className="w-full gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="h-4 w-4" />
                      Analyze Question Papers
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="mt-4 text-muted-foreground">
            Analyzing question papers...
          </p>
          <p className="text-sm text-muted-foreground">
            This may take a few moments
          </p>
        </motion.div>
      )}

      {/* Analysis Results */}
      {analysis && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Analysis Complete
              </CardTitle>
              <CardDescription>
                Analyzed {analysis.totalQuestions} questions from {analysis.yearsCovered.join(", ")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground">Total Questions</p>
                  <p className="text-2xl font-bold">{analysis.totalQuestions}</p>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground">Years Covered</p>
                  <p className="text-2xl font-bold">{analysis.yearsCovered.length}</p>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground">Difficulty</p>
                  <p className="text-2xl font-bold">{analysis.examPattern.averageDifficulty}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Important Topics by Frequency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.importantTopics.map((topic, index) => (
                  <motion.div
                    key={topic.topic}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{topic.topic}</span>
                        <Badge
                          variant="secondary"
                          className={getImportanceColor(topic.importance)}
                        >
                          {topic.importance}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {topic.frequency} questions ({topic.percentage}%)
                      </span>
                    </div>
                    <Progress value={topic.percentage * 2} className="h-2" />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Exam Pattern */}
          <Card>
            <CardHeader>
              <CardTitle>Exam Pattern Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col items-center rounded-lg border border-border p-4">
                  <div className="text-3xl font-bold text-primary">
                    {analysis.examPattern.mcqPercentage}%
                  </div>
                  <p className="text-sm text-muted-foreground">MCQ Questions</p>
                </div>
                <div className="flex flex-col items-center rounded-lg border border-border p-4">
                  <div className="text-3xl font-bold text-primary">
                    {analysis.examPattern.numericalPercentage}%
                  </div>
                  <p className="text-sm text-muted-foreground">Numerical</p>
                </div>
                <div className="flex flex-col items-center rounded-lg border border-border p-4">
                  <div className="text-3xl font-bold text-primary">
                    {analysis.examPattern.theoryPercentage}%
                  </div>
                  <p className="text-sm text-muted-foreground">Theory</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysis.recommendations.map((rec, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {index + 1}
                    </div>
                    <span className="text-muted-foreground">{rec}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setAnalysis(null);
                setUploadedFileId(null);
              }}
            >
              Analyze Another
            </Button>
            <Button className="gap-2">
              Generate Study Plan
              <TrendingUp className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default PYQModule;
