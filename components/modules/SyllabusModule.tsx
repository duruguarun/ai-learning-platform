"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Loader2, Book, Clock, ChevronRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUploadModule } from "./FileUploadModule";
import { useAppStore } from "@/lib/store/useAppStore";
import { syllabusAPI } from "@/lib/services/api";
import { mockSyllabusData } from "@/lib/mock/mockData";

export function SyllabusModule() {
  const [isParsing, setIsParsing] = useState(false);
  const [syllabus, setSyllabus] = useState<typeof mockSyllabusData | null>(null);
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());

  const { addGeneratedContent, addWorkflowStep, setSelectedTopics } = useAppStore();

  const handleFileUpload = (fileData: { id: string }) => {
    setUploadedFileId(fileData.id);
  };

  const handleParseSyllabus = async () => {
    if (!uploadedFileId) return;

    setIsParsing(true);

    addWorkflowStep({
      id: `syllabus-${Date.now()}`,
      title: "Parse Syllabus",
      type: "syllabus",
      status: "active",
    });

    try {
      const response = await syllabusAPI.parseSyllabus(uploadedFileId);
      
      if (response.success) {
        setSyllabus(response.data);
        
        // Extract all topic names for study plan generation
        const topicNames = response.data.units.flatMap(unit => 
          unit.topics.map(topic => topic.name)
        );
        setSelectedTopics(topicNames);
        
        addGeneratedContent({
          type: "syllabus",
          title: `${response.data.subject} - ${response.data.course}`,
          content: response.data,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Failed to parse syllabus:", error);
    } finally {
      setIsParsing(false);
    }
  };

  const handleUsePreloaded = async () => {
    setIsParsing(true);

    try {
      // Simulate using a preloaded syllabus
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSyllabus(mockSyllabusData);
      
      const topicNames = mockSyllabusData.units.flatMap(unit => 
        unit.topics.map(topic => topic.name)
      );
      setSelectedTopics(topicNames);
      
      addGeneratedContent({
        type: "syllabus",
        title: `${mockSyllabusData.subject} - ${mockSyllabusData.course}`,
        content: mockSyllabusData,
        createdAt: new Date().toISOString(),
      });
    } finally {
      setIsParsing(false);
    }
  };

  const toggleTopicCompletion = (topicId: string) => {
    const newCompleted = new Set(completedTopics);
    if (newCompleted.has(topicId)) {
      newCompleted.delete(topicId);
    } else {
      newCompleted.add(topicId);
    }
    setCompletedTopics(newCompleted);
  };

  const calculateProgress = () => {
    if (!syllabus) return 0;
    const totalTopics = syllabus.units.reduce((acc, unit) => acc + unit.topics.length, 0);
    return Math.round((completedTopics.size / totalTopics) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Upload Syllabus</h2>
            <p className="text-sm text-muted-foreground">
              Parse your syllabus to extract units and topics
            </p>
          </div>
        </div>
      </div>

      {/* Upload or Select Syllabus */}
      {!syllabus && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upload Your Syllabus</CardTitle>
              <CardDescription>
                Upload a PDF or image of your syllabus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploadModule
                title=""
                description="Drag and drop or click to upload"
                acceptedTypes={["application/pdf", "image/*"]}
                onUploadComplete={handleFileUpload}
              />
              
              {uploadedFileId && (
                <Button 
                  onClick={handleParseSyllabus} 
                  disabled={isParsing}
                  className="mt-4 w-full gap-2"
                >
                  {isParsing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Parsing...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      Parse Syllabus
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Use Preloaded Syllabus</CardTitle>
              <CardDescription>
                Choose from our library of common syllabi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={handleUsePreloaded}
                disabled={isParsing}
              >
                <Book className="h-4 w-4" />
                Data Structures and Algorithms
                <ChevronRight className="ml-auto h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                disabled={isParsing}
              >
                <Book className="h-4 w-4" />
                Physics - Mechanics
                <ChevronRight className="ml-auto h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                disabled={isParsing}
              >
                <Book className="h-4 w-4" />
                Mathematics - Calculus
                <ChevronRight className="ml-auto h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading State */}
      {isParsing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="mt-4 text-muted-foreground">Parsing syllabus...</p>
        </motion.div>
      )}

      {/* Parsed Syllabus */}
      {syllabus && !isParsing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{syllabus.course}</CardTitle>
                  <CardDescription>{syllabus.subject}</CardDescription>
                </div>
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" />
                  {syllabus.totalHours} hours
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="mb-1 flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{calculateProgress()}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${calculateProgress()}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{completedTopics.size}</p>
                  <p className="text-xs text-muted-foreground">
                    of {syllabus.units.reduce((acc, u) => acc + u.topics.length, 0)} topics
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Units and Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Units & Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="space-y-2">
                {syllabus.units.map((unit, unitIndex) => (
                  <AccordionItem
                    key={unit.id}
                    value={unit.id}
                    className="rounded-lg border border-border px-4"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                          {unitIndex + 1}
                        </div>
                        <div className="text-left">
                          <p className="font-medium">{unit.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {unit.topics.length} topics
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pb-2">
                        {unit.topics.map((topic) => (
                          <div
                            key={topic.id}
                            className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50"
                          >
                            <Checkbox
                              id={topic.id}
                              checked={completedTopics.has(topic.id)}
                              onCheckedChange={() => toggleTopicCompletion(topic.id)}
                            />
                            <label
                              htmlFor={topic.id}
                              className="flex flex-1 cursor-pointer items-center justify-between"
                            >
                              <span className={completedTopics.has(topic.id) ? "line-through text-muted-foreground" : ""}>
                                {topic.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {topic.hours}h
                              </span>
                            </label>
                            {completedTopics.has(topic.id) && (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setSyllabus(null);
                setUploadedFileId(null);
                setCompletedTopics(new Set());
              }}
            >
              Upload Different Syllabus
            </Button>
            <Button className="gap-2">
              Generate Study Plan
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default SyllabusModule;
