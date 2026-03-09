"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Check,
  Calculator,
  Atom,
  FlaskRoundIcon as Flask,
  Leaf,
  Code,
  BookOpenIcon as Book,
  Eye,
  Headphones,
  FileText,
  Hand,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store/useAppStore";
import { mockOnboardingOptions } from "@/lib/mock/mockData";

const subjectIcons: Record<string, React.ElementType> = {
  calculator: Calculator,
  atom: Atom,
  flask: Flask,
  leaf: Leaf,
  code: Code,
  book: Book,
};

const learningStyleIcons: Record<string, React.ElementType> = {
  visual: Eye,
  auditory: Headphones,
  reading: FileText,
  kinesthetic: Hand,
};

const steps = [
  { id: 1, title: "Subjects", description: "What do you want to learn?" },
  { id: 2, title: "Learning Style", description: "How do you learn best?" },
  { id: 3, title: "Exam Type", description: "What are you preparing for?" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const { onboarding, setOnboarding, completeOnboarding, user } = useAppStore();

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(onboarding.subjects);
  const [selectedLearningStyle, setSelectedLearningStyle] = useState(onboarding.learningStyle);
  const [selectedExamType, setSelectedExamType] = useState(onboarding.examType);

  const progress = (currentStep / steps.length) * 100;

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setOnboarding({ subjects: selectedSubjects });
    } else if (currentStep === 2) {
      setOnboarding({ learningStyle: selectedLearningStyle });
    } else if (currentStep === 3) {
      setOnboarding({ examType: selectedExamType });
      completeOnboarding();
      router.push("/features");
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedSubjects.length > 0;
      case 2:
        return selectedLearningStyle !== "";
      case 3:
        return selectedExamType !== "";
      default:
        return false;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border p-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">LearnAI</span>
          </div>
          {user && (
            <span className="text-sm text-muted-foreground">
              Welcome, {user.name}!
            </span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Progress */}
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">Step {currentStep} of {steps.length}</span>
              <span className="text-muted-foreground">{steps[currentStep - 1].title}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 1: Subjects */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold">What subjects interest you?</h2>
                  <p className="mt-2 text-muted-foreground">
                    Select one or more subjects you&apos;d like to learn
                  </p>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {mockOnboardingOptions.subjects.map((subject) => {
                      const Icon = subjectIcons[subject.icon] || Book;
                      const isSelected = selectedSubjects.includes(subject.id);
                      return (
                        <Card
                          key={subject.id}
                          className={cn(
                            "cursor-pointer transition-all hover:border-primary",
                            isSelected && "border-primary bg-primary/5"
                          )}
                          onClick={() => handleSubjectToggle(subject.id)}
                        >
                          <CardContent className="flex items-center gap-4 p-4">
                            <div className={cn(
                              "flex h-12 w-12 items-center justify-center rounded-lg",
                              isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                            )}>
                              <Icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <span className="font-medium">{subject.label}</span>
                            </div>
                            {isSelected && (
                              <Check className="h-5 w-5 text-primary" />
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Learning Style */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold">How do you learn best?</h2>
                  <p className="mt-2 text-muted-foreground">
                    Choose your preferred learning style
                  </p>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {mockOnboardingOptions.learningStyles.map((style) => {
                      const Icon = learningStyleIcons[style.id] || Eye;
                      const isSelected = selectedLearningStyle === style.id;
                      return (
                        <Card
                          key={style.id}
                          className={cn(
                            "cursor-pointer transition-all hover:border-primary",
                            isSelected && "border-primary bg-primary/5"
                          )}
                          onClick={() => setSelectedLearningStyle(style.id)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className={cn(
                                "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
                                isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                              )}>
                                <Icon className="h-6 w-6" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{style.label}</span>
                                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {style.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Exam Type */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold">What are you preparing for?</h2>
                  <p className="mt-2 text-muted-foreground">
                    Select the type of exam or certification
                  </p>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {mockOnboardingOptions.examTypes.map((exam) => {
                      const isSelected = selectedExamType === exam.id;
                      return (
                        <Card
                          key={exam.id}
                          className={cn(
                            "cursor-pointer transition-all hover:border-primary",
                            isSelected && "border-primary bg-primary/5"
                          )}
                          onClick={() => setSelectedExamType(exam.id)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{exam.label}</span>
                              {isSelected && <Check className="h-5 w-5 text-primary" />}
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">
                              {exam.examples}
                            </p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-12 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="gap-2"
            >
              {currentStep === 3 ? "Complete Setup" : "Continue"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
