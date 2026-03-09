// Global State Management with Zustand
// This store manages all application state across pages

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Type definitions
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  studyStreak?: number;
}

interface Document {
  id: string;
  name: string;
  type: string;
  subject: string;
  uploadedAt: string;
  tags?: string[];
}

interface StudyTask {
  title: string;
  duration?: string;
  priority?: "high" | "medium" | "low";
}

interface StudyPlan {
  id: string;
  name: string;
  tasks: StudyTask[];
}

interface OnboardingData {
  subjects: string[];
  learningStyle: string;
  examType: string;
  completed: boolean;
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
}

interface WorkflowStep {
  id: string;
  title: string;
  type: string;
  status: "pending" | "active" | "completed";
  data?: Record<string, unknown>;
}

interface GeneratedContent {
  type: string;
  title: string;
  content: unknown;
  createdAt: string;
}

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
}

interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
}

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;

  // Onboarding state
  onboarding: OnboardingData;

  // Feature and workspace state
  currentFeature: string | null;
  uploadedFiles: UploadedFile[];
  selectedTopics: string[];

  // Workflow state
  workflowSteps: WorkflowStep[];
  activeStepIndex: number;

  // Content state
  generatedContent: GeneratedContent[];
  currentContent: GeneratedContent | null;

  // Chat state
  chatMessages: ChatMessage[];

  // Quiz state
  quizResults: QuizResult[];

  // Page state
  activePage: string;
  documents: Document[];
  studyPlan: StudyPlan | null;

  // Loading states
  isLoading: boolean;
  loadingMessage: string;

  // Actions
  setUser: (user: User | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;

  setOnboarding: (data: Partial<OnboardingData>) => void;
  completeOnboarding: () => void;

  setCurrentFeature: (feature: string | null) => void;
  addUploadedFile: (file: UploadedFile) => void;
  removeUploadedFile: (fileId: string) => void;
  setSelectedTopics: (topics: string[]) => void;
  addSelectedTopic: (topic: string) => void;
  removeSelectedTopic: (topic: string) => void;

  setWorkflowSteps: (steps: WorkflowStep[]) => void;
  addWorkflowStep: (step: WorkflowStep) => void;
  updateWorkflowStep: (stepId: string, updates: Partial<WorkflowStep>) => void;
  setActiveStepIndex: (index: number) => void;
  completeCurrentStep: () => void;

  addGeneratedContent: (content: GeneratedContent) => void;
  setCurrentContent: (content: GeneratedContent | null) => void;
  clearGeneratedContent: () => void;

  addChatMessage: (message: ChatMessage) => void;
  clearChatMessages: () => void;

  addQuizResult: (result: QuizResult) => void;

  setLoading: (isLoading: boolean, message?: string) => void;

  // Page actions
  setActivePage: (page: string) => void;
  fetchDashboardData: () => void;
  fetchDocuments: () => void;

  // Reset state
  resetStore: () => void;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  token: null,
  onboarding: {
    subjects: [],
    learningStyle: "",
    examType: "",
    completed: false,
  },
  currentFeature: null,
  uploadedFiles: [],
  selectedTopics: [],
  workflowSteps: [],
  activeStepIndex: 0,
  generatedContent: [],
  currentContent: null,
  chatMessages: [
    {
      id: 1,
      role: "assistant" as const,
      content: "Hello! I'm your AI learning assistant. How can I help you today?",
    },
  ],
  quizResults: [],
  activePage: "dashboard",
  documents: [],
  studyPlan: null,
  isLoading: false,
  loadingMessage: "",
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // User actions
      setUser: (user) => set({ user }),

      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      // Onboarding actions
      setOnboarding: (data) =>
        set((state) => ({
          onboarding: { ...state.onboarding, ...data },
        })),

      completeOnboarding: () =>
        set((state) => ({
          onboarding: { ...state.onboarding, completed: true },
        })),

      // Feature and workspace actions
      setCurrentFeature: (feature) => set({ currentFeature: feature }),

      addUploadedFile: (file) =>
        set((state) => ({
          uploadedFiles: [...state.uploadedFiles, file],
        })),

      removeUploadedFile: (fileId) =>
        set((state) => ({
          uploadedFiles: state.uploadedFiles.filter((f) => f.id !== fileId),
        })),

      setSelectedTopics: (topics) => set({ selectedTopics: topics }),

      addSelectedTopic: (topic) =>
        set((state) => ({
          selectedTopics: state.selectedTopics.includes(topic)
            ? state.selectedTopics
            : [...state.selectedTopics, topic],
        })),

      removeSelectedTopic: (topic) =>
        set((state) => ({
          selectedTopics: state.selectedTopics.filter((t) => t !== topic),
        })),

      // Workflow actions
      setWorkflowSteps: (steps) => set({ workflowSteps: steps }),

      addWorkflowStep: (step) =>
        set((state) => ({
          workflowSteps: [...state.workflowSteps, step],
        })),

      updateWorkflowStep: (stepId, updates) =>
        set((state) => ({
          workflowSteps: state.workflowSteps.map((step) =>
            step.id === stepId ? { ...step, ...updates } : step
          ),
        })),

      setActiveStepIndex: (index) => set({ activeStepIndex: index }),

      completeCurrentStep: () => {
        const { workflowSteps, activeStepIndex } = get();
        const updatedSteps = workflowSteps.map((step, index) => ({
          ...step,
          status:
            index < activeStepIndex
              ? ("completed" as const)
              : index === activeStepIndex
              ? ("completed" as const)
              : index === activeStepIndex + 1
              ? ("active" as const)
              : ("pending" as const),
        }));
        set({
          workflowSteps: updatedSteps,
          activeStepIndex: Math.min(activeStepIndex + 1, workflowSteps.length - 1),
        });
      },

      // Content actions
      addGeneratedContent: (content) =>
        set((state) => ({
          generatedContent: [content, ...state.generatedContent],
          currentContent: content,
        })),

      setCurrentContent: (content) => set({ currentContent: content }),

      clearGeneratedContent: () =>
        set({ generatedContent: [], currentContent: null }),

      // Chat actions
      addChatMessage: (message) =>
        set((state) => ({
          chatMessages: [...state.chatMessages, message],
        })),

      clearChatMessages: () =>
        set({
          chatMessages: [
            {
              id: 1,
              role: "assistant",
              content: "Hello! I'm your AI learning assistant. How can I help you today?",
            },
          ],
        }),

      // Quiz actions
      addQuizResult: (result) =>
        set((state) => ({
          quizResults: [result, ...state.quizResults],
        })),

      // Loading actions
      setLoading: (isLoading, message = "") =>
        set({ isLoading, loadingMessage: message }),

      // Page actions
      setActivePage: (page) => set({ activePage: page }),

      fetchDashboardData: () => {
        // Simulate fetching dashboard data
        set({
          studyPlan: {
            id: "1",
            name: "Today's Study Plan",
            tasks: [
              { title: "Review Organic Chemistry", duration: "1 hr", priority: "high" },
              { title: "Practice PYQ - Physics", duration: "45 min", priority: "medium" },
              { title: "Read Chapter 6 - Maths", duration: "30 min", priority: "low" },
              { title: "Biology Quick Revision", duration: "20 min", priority: "medium" },
            ],
          },
        });
      },

      fetchDocuments: () => {
        // Simulate fetching documents
        set({
          documents: [
            { id: "1", name: "Physics Notes - Thermodynamics", type: "notes", subject: "Physics", uploadedAt: "2024-03-01", tags: ["thermodynamics", "heat"] },
            { id: "2", name: "Chemistry Syllabus 2024", type: "syllabus", subject: "Chemistry", uploadedAt: "2024-02-28", tags: ["syllabus"] },
            { id: "3", name: "Mathematics PYQ 2023", type: "pyq", subject: "Mathematics", uploadedAt: "2024-02-25", tags: ["calculus", "algebra"] },
            { id: "4", name: "Biology Quiz - Cell Structure", type: "quiz", subject: "Biology", uploadedAt: "2024-02-20", tags: ["cells"] },
            { id: "5", name: "English Literature Notes", type: "notes", subject: "English", uploadedAt: "2024-02-18", tags: ["literature"] },
            { id: "6", name: "Computer Science PYQ 2022", type: "pyq", subject: "Computer Science", uploadedAt: "2024-02-15", tags: ["algorithms"] },
          ],
        });
      },

      // Reset
      resetStore: () => set(initialState),
    }),
    {
      name: "ai-learning-platform-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        onboarding: state.onboarding,
        uploadedFiles: state.uploadedFiles,
        generatedContent: state.generatedContent,
        quizResults: state.quizResults,
      }),
    }
  )
);

export default useAppStore;
