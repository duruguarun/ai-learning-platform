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

export function PYQModule() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState<string>('Analyzing question papers...');
  const [analysis, setAnalysis] = useState<any | null>(null);
  // store both truncated display and full text for each agent step
  const [agentOutputs, setAgentOutputs] = useState<{display:string; full:string;}[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);

  const { addGeneratedContent, addWorkflowStep } = useAppStore();

  const handleFileUpload = async (fileData: { id: string; name: string }, file?: File) => {
    setUploadedFileId(fileData.id);
    setUploadedFile(file || null);
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);
    setLoaderMessage('Uploading file and preparing agents...');

    // Add workflow step
    addWorkflowStep({
      id: `pyq-${Date.now()}`,
      title: "PYQ Analysis",
      type: "pyq",
      status: "active",
    });

    try {
      // once the request starts, switch message to indicate agents have taken over
      setLoaderMessage('Running AI agents...');
      const response = await pyqAPI.analyzePYQ(uploadedFile);
      
      if (response.success) {
        // sequentially reveal agent outputs like chat heartbeats
        const outputs = response.data.agentOutputs || [];
        for (let i = 0; i < outputs.length; i++) {
          // try to stringify whatever the agent returned
          const raw = outputs[i].output;
          const fullText = typeof raw === 'string' ? raw : JSON.stringify(raw, null, 2);
          let msgBody = fullText;
          // truncate long outputs for loader display
          if (msgBody.length > 200) {
            msgBody = msgBody.slice(0, 200) + '...';
          }
          const stepMsg = `Step ${i + 1}: ${msgBody}`;
          setLoaderMessage(stepMsg);
          setAgentOutputs((prev) => [...prev, { display: stepMsg, full: fullText }]);
          // pause briefly so user can read each step
          await new Promise((r) => setTimeout(r, 1500));
        }

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
      setLoaderMessage('Analyzing question papers...');
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
          <p className="mt-4 text-muted-foreground max-w-prose text-center whitespace-pre-wrap">
            {loaderMessage}
          </p>
          <p className="text-sm text-muted-foreground">
            This may take a few moments
          </p>
          {agentOutputs.length > 0 && (
            <div className="mt-4 w-full max-w-md space-y-1">
              {agentOutputs.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.2 }}
                  className="text-xs text-muted-foreground italic animate-pulse"
                >
                  {item.display}
                </motion.div>
              ))}
            </div>
          )}
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
                {analysis.isPartial ? (
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                )}
                {analysis.isPartial ? 'Analysis Partially Complete' : 'Analysis Complete'}
              </CardTitle>
              <CardDescription>
                Analyzed {analysis.papers_analysed || 1} paper(s) • {analysis.totalQuestions} questions
                {analysis.isPartial && (
                  <span className="block text-orange-600 mt-1">
                    {analysis.partialMessage}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground">Total Questions</p>
                  <p className="text-2xl font-bold">{analysis.totalQuestions}</p>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground">Papers Analyzed</p>
                  <p className="text-2xl font-bold">{analysis.papers_analysed || 1}</p>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground">Top Topics</p>
                  <p className="text-2xl font-bold">{analysis.importantTopics?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Important Topics by Probability
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
                        {topic.frequency} questions ({topic.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={topic.percentage} className="h-2" />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Exam Pattern */}
          <Card>
            <CardHeader>
              <CardTitle>Exam Pattern Breakdown</CardTitle>
              <CardDescription>{analysis.paper_pattern?.pattern_summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 mb-4">
                <div className="flex flex-col items-center rounded-lg border border-border p-4">
                  <div className="text-3xl font-bold text-primary">
                    {analysis.paper_pattern?.total_marks || analysis.totalQuestions}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Marks</p>
                </div>
                <div className="flex flex-col items-center rounded-lg border border-border p-4">
                  <div className="text-3xl font-bold text-primary">
                    {analysis.paper_pattern?.total_questions || analysis.totalQuestions}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Questions</p>
                </div>
              </div>
              {analysis.paper_pattern?.sections && (
                <div className="space-y-2">
                  <h4 className="font-medium">Sections:</h4>
                  {analysis.paper_pattern.sections.map((section: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{section.name}</span>
                      <span>{section.questions} questions × {section.marks_per_q} marks = {section.total_marks} marks</span>
                    </div>
                  ))}
                </div>
              )}
              {analysis.paper_pattern?.common_question_types && (
                <div className="mt-4">
                  <h4 className="font-medium">Question Types:</h4>
                  <div className="flex gap-2 mt-2">
                    {analysis.paper_pattern.common_question_types.map((type: string, index: number) => (
                      <Badge key={index} variant="secondary">{type}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Frequent Questions */}
          {analysis.frequent_questions && analysis.frequent_questions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-500" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis.frequent_questions.map((q: any, index: number) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-muted rounded-lg"
                    >
                      <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{q.question}</p>
                        <p className="text-xs text-muted-foreground">
                          Appeared {q.frequency} times in {q.years_appeared.join(", ")}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Raw Insights (if partial) */}
          {analysis.isPartial && analysis.rawInsights && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  Raw Analysis Insights
                </CardTitle>
                <CardDescription>
                  Unprocessed output from the AI analysis pipeline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
                    {analysis.rawInsights}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.important_topics_summary && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">Summary:</p>
                    <p className="text-sm text-muted-foreground">{analysis.important_topics_summary}</p>
                  </div>
                )}
                <ul className="space-y-3">
                  {analysis.recommendations?.map((rec, index) => (
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
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setAnalysis(null);
                setAgentOutputs([]);
                setUploadedFileId(null);
                setUploadedFile(null);
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
