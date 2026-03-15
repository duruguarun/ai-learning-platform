// API Service Layer
// Placeholder endpoints that return mock data
// These will be replaced with actual API calls when backend is ready

import {
  mockUser,
  mockConceptResponse,
  mockPYQAnalysis,
  mockSyllabusData,
  mockStudyPlan,
  mockQuizQuestions,
} from "@/lib/mock/mockData";

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

/**
 * API Endpoints - These are placeholders that simulate backend responses
 * Replace with actual axios calls when backend is integrated
 */

// Authentication
export const authAPI = {
  login: async (email: string, _password: string) => {
    await delay(800);
    // Simulate successful login
    return {
      success: true,
      user: { ...mockUser, email },
      token: "mock_jwt_token_" + Date.now(),
    };
  },

  signup: async (name: string, email: string, _password: string) => {
    await delay(1000);
    return {
      success: true,
      user: { ...mockUser, name, email, id: "user_" + Date.now() },
      token: "mock_jwt_token_" + Date.now(),
    };
  },

  logout: async () => {
    await delay(300);
    return { success: true };
  },
};

// File Upload
export const uploadAPI = {
  uploadFile: async (file: File) => {
    await delay(1500);
    // Simulate file upload
    return {
      success: true,
      fileId: "file_" + Date.now(),
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadedAt: new Date().toISOString(),
    };
  },

  getUploadedFiles: async () => {
    await delay(500);
    return {
      success: true,
      files: [],
    };
  },
};

// Concept Explanation
export const conceptAPI = {
  explainConcept: async (topic: string) => {
    await delay(2000);
    return {
      success: true,
      data: {
        ...mockConceptResponse,
        topic,
      },
    };
  },

  getRelatedTopics: async (_topic: string) => {
    await delay(500);
    return {
      success: true,
      topics: mockConceptResponse.relatedTopics,
    };
  },
};

// PYQ Analysis
export const pyqAPI = {
  analyzePYQ: async (file: File) => {
    // Send to exam-analyser API
    const formData = new FormData();
    formData.append('files', file);

    const response = await fetch('http://localhost:8000/analyse', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to analyze PYQ');
    }

    const data = await response.json();

    // Handle responses gracefully - treat any missing data as partial
    const hasRequiredData = data.paper_pattern && data.frequent_questions && data.ranked_topics;
    const isPartial = data.status === 'partial' || !hasRequiredData;

    // For partial responses, provide defaults and show raw insights
    const transformedData = {
      documentName: file.name,
      totalQuestions: data.paper_pattern?.total_questions || 0,
      yearsCovered: Array.isArray(data.frequent_questions)
        ? data.frequent_questions
            .map((q: any) => q.years_appeared)
            .flat()
            .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i)
        : [],
      importantTopics: Array.isArray(data.ranked_topics)
        ? data.ranked_topics.map((topic: any) => ({
            topic: topic.topic || 'Unknown',
            frequency: topic.frequency || 0,
            importance: (topic.probability_percent || 0) > 80 ? 'high' : (topic.probability_percent || 0) > 60 ? 'medium' : 'low',
            percentage: data.paper_pattern?.total_questions
              ? ((topic.frequency || 0) / data.paper_pattern.total_questions) * 100
              : 0,
          }))
        : [],
      examPattern: {
        mcqPercentage: data.paper_pattern?.common_question_types?.includes('MCQ') ? 60 : 0,
        numericalPercentage: data.paper_pattern?.common_question_types?.includes('Numerical') ? 25 : 0,
        theoryPercentage: (data.paper_pattern?.common_question_types?.includes('Essay') ||
                          data.paper_pattern?.common_question_types?.includes('Short Answer')) ? 15 : 0,
        averageDifficulty: 'Medium',
      },
      recommendations: [
        data.important_topics_summary || 'No summary available',
        ...(Array.isArray(data.frequent_questions) && data.frequent_questions.length > 0
          ? data.frequent_questions.slice(0, 3).map((q: any) => `Practice: ${q.question || 'Unknown question'}`)
          : []),
      ],
      agentOutputs: Array.isArray(data.agent_outputs) ? data.agent_outputs : [],
      isPartial,
      partialMessage: isPartial ? data.message || 'Analysis completed but some data could not be processed.' : null,
      rawInsights: isPartial ? data.raw_insights : null,
    };

    return {
      success: true,
      data: transformedData,
    };
  },

  getTopicAnalysis: async (_fileId: string, topic: string) => {
    await delay(1000);
    const topicData = mockPYQAnalysis.importantTopics.find(
      (t) => t.topic.toLowerCase() === topic.toLowerCase()
    );
    return {
      success: true,
      data: topicData || mockPYQAnalysis.importantTopics[0],
    };
  },
};

// Syllabus Parsing
export const syllabusAPI = {
  parseSyllabus: async (_fileId: string) => {
    await delay(2500);
    return {
      success: true,
      data: mockSyllabusData,
    };
  },

  getPreloadedSyllabi: async () => {
    await delay(500);
    return {
      success: true,
      syllabi: [
        { id: "syl_001", name: "Computer Science - Data Structures", university: "Generic" },
        { id: "syl_002", name: "Physics - Mechanics", university: "Generic" },
        { id: "syl_003", name: "Mathematics - Calculus", university: "Generic" },
      ],
    };
  },
};

// Study Plan Generation
export const studyPlanAPI = {
  generateStudyPlan: async (_params: {
    syllabusId?: string;
    pyqAnalysisId?: string;
    topics?: string[];
    startDate: string;
    endDate: string;
    hoursPerWeek: number;
  }) => {
    await delay(2000);
    return {
      success: true,
      data: mockStudyPlan,
    };
  },

  updateStudyPlan: async (_planId: string, _updates: Record<string, unknown>) => {
    await delay(500);
    return {
      success: true,
      message: "Study plan updated successfully",
    };
  },
};

// Quiz Generation
export const quizAPI = {
  generateQuiz: async (_params: { topics: string[]; count: number; difficulty: string }) => {
    await delay(1500);
    return {
      success: true,
      data: {
        quizId: "quiz_" + Date.now(),
        questions: mockQuizQuestions,
      },
    };
  },

  submitQuizAnswer: async (_quizId: string, _questionId: number, _answer: number) => {
    await delay(300);
    return {
      success: true,
      isCorrect: Math.random() > 0.3,
    };
  },

  getQuizResults: async (_quizId: string) => {
    await delay(500);
    return {
      success: true,
      data: {
        score: 80,
        totalQuestions: 5,
        correctAnswers: 4,
        timeTaken: 300,
      },
    };
  },
};

// AI Chat
export const chatAPI = {
  sendMessage: async (message: string, _context?: { topic?: string; feature?: string }) => {
    await delay(1000);
    
    // Simple response simulation based on keywords
    let response = "I understand your question. Let me help you with that.";
    
    if (message.toLowerCase().includes("explain")) {
      response = "Great question! Let me break this down for you. The concept involves several key components that work together...";
    } else if (message.toLowerCase().includes("quiz") || message.toLowerCase().includes("test")) {
      response = "I can generate practice questions for you. Would you like me to create a quiz on the current topic?";
    } else if (message.toLowerCase().includes("help")) {
      response = "I'm here to assist you with your learning journey. You can ask me to explain concepts, generate quizzes, or help with study planning.";
    }
    
    return {
      success: true,
      message: {
        id: Date.now(),
        role: "assistant" as const,
        content: response,
      },
    };
  },
};

// Animation Generator
export const animationAPI = {
  // Start a new animation job, returns job_id immediately
  generate: async (topic: string): Promise<{ job_id: string; status: string; topic: string }> => {
    const response = await fetch("http://localhost:8001/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: "Unknown error" }));
      throw new Error(err.detail || "Failed to start animation job");
    }
    return response.json();
  },

  // Poll job status
  getStatus: async (jobId: string): Promise<{
    job_id: string;
    status: "queued" | "generating" | "rendering" | "done" | "error";
    topic: string;
    video_url: string | null;
    error: string | null;
    code: string | null;
  }> => {
    const response = await fetch(`http://localhost:8001/status/${jobId}`);
    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: "Unknown error" }));
      throw new Error(err.detail || "Failed to get job status");
    }
    return response.json();
  },

  // Get the full video URL (for <video> src)
  getVideoUrl: (jobId: string): string => {
    return `http://localhost:8001/video/${jobId}`;
  },

  // Health check
  health: async (): Promise<boolean> => {
    try {
      const r = await fetch("http://localhost:8001/health", { signal: AbortSignal.timeout(3000) });
      return r.ok;
    } catch {
      return false;
    }
  },
};

// Dashboard & Analytics
export const dashboardAPI = {
  getProgress: async (_userId: string) => {
    await delay(500);
    return {
      success: true,
      data: {
        overallProgress: 42,
        topicsCompleted: 8,
        totalTopics: 20,
      },
    };
  },

  getActivity: async (_userId: string, _days: number) => {
    await delay(500);
    return {
      success: true,
      data: [
        { day: "Mon", hours: 3 },
        { day: "Tue", hours: 4 },
        { day: "Wed", hours: 2 },
        { day: "Thu", hours: 5 },
        { day: "Fri", hours: 3 },
        { day: "Sat", hours: 6 },
        { day: "Sun", hours: 4 },
      ],
    };
  },
};

// Export all APIs
export const api = {
  auth: authAPI,
  upload: uploadAPI,
  concept: conceptAPI,
  pyq: pyqAPI,
  syllabus: syllabusAPI,
  studyPlan: studyPlanAPI,
  quiz: quizAPI,
  chat: chatAPI,
  dashboard: dashboardAPI,
  animation: animationAPI,
};

export default api;
