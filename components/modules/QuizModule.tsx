"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Loader2, CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store/useAppStore";
import { quizAPI } from "@/lib/services/api";
import { mockQuizQuestions } from "@/lib/mock/mockData";

type QuizQuestion = typeof mockQuizQuestions[0];

interface QuizResult {
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
}

export function QuizModule() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);

  const { addGeneratedContent, addWorkflowStep, addQuizResult } = useAppStore();

  const handleGenerateQuiz = async () => {
    setIsGenerating(true);
    setQuizComplete(false);
    setResults([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);

    addWorkflowStep({
      id: `quiz-${Date.now()}`,
      title: "Practice Quiz",
      type: "quiz",
      status: "active",
    });

    try {
      const response = await quizAPI.generateQuiz({
        topics: ["Data Structures", "Algorithms"],
        count: 5,
        difficulty: "medium",
      });
      
      if (response.success) {
        setQuestions(response.data.questions);
      }
    } catch (error) {
      console.error("Failed to generate quiz:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    const result: QuizResult = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
    };

    setResults([...results, result]);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz complete
      setQuizComplete(true);
      
      const correctAnswers = results.filter(r => r.isCorrect).length + 
        (selectedAnswer === questions[currentQuestionIndex].correctAnswer ? 1 : 0);
      const score = Math.round((correctAnswers / questions.length) * 100);
      
      addQuizResult({
        quizId: `quiz_${Date.now()}`,
        score,
        totalQuestions: questions.length,
        correctAnswers,
        completedAt: new Date().toISOString(),
      });

      addGeneratedContent({
        type: "quiz-result",
        title: "Quiz Results",
        content: { score, correctAnswers, totalQuestions: questions.length },
        createdAt: new Date().toISOString(),
      });
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 
    ? ((currentQuestionIndex + (showResult ? 1 : 0)) / questions.length) * 100 
    : 0;

  const finalScore = results.filter(r => r.isCorrect).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500">
            <HelpCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Practice Quiz</h2>
            <p className="text-sm text-muted-foreground">
              Test your knowledge with AI-generated questions
            </p>
          </div>
        </div>
      </div>

      {/* Start Quiz */}
      {questions.length === 0 && !isGenerating && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ready to Test Your Knowledge?</CardTitle>
            <CardDescription>
              Generate a quiz based on your selected topics and learning progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border p-4 text-center">
                <p className="text-2xl font-bold text-primary">5</p>
                <p className="text-sm text-muted-foreground">Questions</p>
              </div>
              <div className="rounded-lg border border-border p-4 text-center">
                <p className="text-2xl font-bold text-primary">MCQ</p>
                <p className="text-sm text-muted-foreground">Format</p>
              </div>
              <div className="rounded-lg border border-border p-4 text-center">
                <p className="text-2xl font-bold text-primary">Medium</p>
                <p className="text-sm text-muted-foreground">Difficulty</p>
              </div>
            </div>
            <Button onClick={handleGenerateQuiz} className="w-full gap-2">
              <HelpCircle className="h-4 w-4" />
              Generate Quiz
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="mt-4 text-muted-foreground">Generating quiz questions...</p>
        </motion.div>
      )}

      {/* Quiz In Progress */}
      {questions.length > 0 && !quizComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="outline">{currentQuestion.topic}</Badge>
                    <span className="text-sm text-muted-foreground">
                      Q{currentQuestionIndex + 1}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={selectedAnswer?.toString()}
                    onValueChange={(value) => !showResult && setSelectedAnswer(parseInt(value))}
                    className="space-y-3"
                  >
                    {currentQuestion.options.map((option, index) => {
                      const isSelected = selectedAnswer === index;
                      const isCorrect = index === currentQuestion.correctAnswer;
                      const showCorrectness = showResult;

                      return (
                        <div
                          key={index}
                          className={cn(
                            "flex items-center space-x-3 rounded-lg border p-4 transition-colors",
                            !showResult && "cursor-pointer hover:bg-muted/50",
                            isSelected && !showResult && "border-primary bg-primary/5",
                            showCorrectness && isCorrect && "border-green-500 bg-green-50",
                            showCorrectness && isSelected && !isCorrect && "border-red-500 bg-red-50"
                          )}
                        >
                          <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={showResult} />
                          <Label
                            htmlFor={`option-${index}`}
                            className={cn(
                              "flex-1 cursor-pointer",
                              showResult && "cursor-default"
                            )}
                          >
                            {option}
                          </Label>
                          {showCorrectness && isCorrect && (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          )}
                          {showCorrectness && isSelected && !isCorrect && (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                      );
                    })}
                  </RadioGroup>

                  {/* Explanation */}
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 rounded-lg bg-muted p-4"
                    >
                      <p className="text-sm font-medium">Explanation:</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {currentQuestion.explanation}
                      </p>
                    </motion.div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex justify-end gap-4">
                    {!showResult ? (
                      <Button
                        onClick={handleAnswerSubmit}
                        disabled={selectedAnswer === null}
                        className="gap-2"
                      >
                        Submit Answer
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button onClick={handleNextQuestion} className="gap-2">
                        {currentQuestionIndex < questions.length - 1 ? (
                          <>
                            Next Question
                            <ArrowRight className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            See Results
                            <Trophy className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}

      {/* Quiz Complete */}
      {quizComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <Card className="text-center">
            <CardContent className="py-12">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Trophy className="h-10 w-10 text-primary" />
              </div>
              <h2 className="mt-6 text-2xl font-bold">Quiz Complete!</h2>
              <p className="mt-2 text-muted-foreground">
                You answered {finalScore} out of {questions.length} questions correctly
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-muted px-6 py-3">
                <span className="text-3xl font-bold text-primary">
                  {Math.round((finalScore / questions.length) * 100)}%
                </span>
                <span className="text-muted-foreground">Score</span>
              </div>
            </CardContent>
          </Card>

          {/* Results Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Results Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {questions.map((question, index) => {
                  const result = results[index];
                  const isCorrect = result?.isCorrect ?? 
                    (index === questions.length - 1 && selectedAnswer === question.correctAnswer);
                  
                  return (
                    <div
                      key={question.id}
                      className="flex items-center gap-3 rounded-lg border border-border p-3"
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="flex-1 text-sm">{question.question}</span>
                      <Badge variant="outline" className="text-xs">
                        {question.topic}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setQuestions([]);
                setQuizComplete(false);
                setResults([]);
              }}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Take Another Quiz
            </Button>
            <Button className="gap-2">
              Review Concepts
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default QuizModule;
