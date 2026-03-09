// Mock Data for AI Learning Platform
// This file contains all mock data used throughout the application

export const mockUser = {
  id: "user_001",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  avatar: "/avatars/default.png",
  createdAt: "2024-01-15",
};

export const mockOnboardingOptions = {
  subjects: [
    { id: "math", label: "Mathematics", icon: "calculator" },
    { id: "physics", label: "Physics", icon: "atom" },
    { id: "chemistry", label: "Chemistry", icon: "flask" },
    { id: "biology", label: "Biology", icon: "leaf" },
    { id: "cs", label: "Computer Science", icon: "code" },
    { id: "history", label: "History", icon: "book" },
  ],
  learningStyles: [
    { id: "visual", label: "Visual Learner", description: "Learn best through images, diagrams, and videos" },
    { id: "auditory", label: "Auditory Learner", description: "Learn best through listening and discussions" },
    { id: "reading", label: "Reading/Writing", description: "Learn best through reading and note-taking" },
    { id: "kinesthetic", label: "Kinesthetic Learner", description: "Learn best through hands-on practice" },
  ],
  examTypes: [
    { id: "competitive", label: "Competitive Exams", examples: "JEE, NEET, UPSC" },
    { id: "university", label: "University Exams", examples: "Semester, Finals" },
    { id: "certification", label: "Certifications", examples: "AWS, Google, Microsoft" },
    { id: "language", label: "Language Tests", examples: "IELTS, TOEFL, GRE" },
  ],
};

export const mockFeatures = [
  {
    id: "concept",
    title: "Explain Concepts",
    description: "Get AI-powered explanations for any topic with visual aids and examples",
    icon: "lightbulb",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "pyq",
    title: "Analyze PYQ Papers",
    description: "Upload previous year questions and get pattern analysis with important topics",
    icon: "fileSearch",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "syllabus",
    title: "Upload Syllabus",
    description: "Parse your syllabus to extract units, topics, and learning objectives",
    icon: "fileText",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "studyplan",
    title: "Generate Study Plan",
    description: "Create personalized weekly study schedules based on your goals",
    icon: "calendar",
    color: "from-orange-500 to-amber-500",
  },
  {
    id: "quiz",
    title: "Practice Quiz",
    description: "Test your knowledge with AI-generated quizzes and get instant feedback",
    icon: "helpCircle",
    color: "from-red-500 to-rose-500",
  },
  {
    id: "simulation",
    title: "Interactive Simulation",
    description: "Learn through interactive visualizations and simulations",
    icon: "play",
    color: "from-indigo-500 to-violet-500",
  },
];

export const mockConceptResponse = {
  topic: "Neural Networks",
  explanation: `
# Neural Networks

Neural Networks are computational models inspired by the human brain's structure and function. They consist of interconnected nodes (neurons) organized in layers.

## Key Components

### 1. Neurons (Nodes)
- Basic processing units that receive inputs and produce outputs
- Each neuron applies a weighted sum and an activation function

### 2. Layers
- **Input Layer**: Receives the initial data
- **Hidden Layers**: Process information through transformations
- **Output Layer**: Produces the final result

### 3. Weights and Biases
- Weights determine the strength of connections
- Biases allow shifting the activation function

## How It Works

1. Input data enters through the input layer
2. Each neuron calculates: output = activation(Σ(weight × input) + bias)
3. Information flows through hidden layers
4. Final output is produced at the output layer

## Applications
- Image Recognition
- Natural Language Processing
- Autonomous Vehicles
- Medical Diagnosis
  `,
  diagrams: [
    { type: "network", title: "Basic Neural Network Architecture" },
    { type: "neuron", title: "Single Neuron Structure" },
  ],
  relatedTopics: ["Deep Learning", "Backpropagation", "Activation Functions", "CNNs", "RNNs"],
};

export const mockPYQAnalysis = {
  documentName: "Physics_PYQ_2020-2024.pdf",
  totalQuestions: 150,
  yearsCovered: ["2020", "2021", "2022", "2023", "2024"],
  importantTopics: [
    { topic: "Mechanics", frequency: 28, importance: "high", percentage: 18.7 },
    { topic: "Electromagnetism", frequency: 25, importance: "high", percentage: 16.7 },
    { topic: "Thermodynamics", frequency: 22, importance: "high", percentage: 14.7 },
    { topic: "Optics", frequency: 20, importance: "medium", percentage: 13.3 },
    { topic: "Modern Physics", frequency: 18, importance: "medium", percentage: 12.0 },
    { topic: "Waves", frequency: 15, importance: "medium", percentage: 10.0 },
    { topic: "Fluid Mechanics", frequency: 12, importance: "low", percentage: 8.0 },
    { topic: "Rotational Motion", frequency: 10, importance: "low", percentage: 6.6 },
  ],
  examPattern: {
    mcqPercentage: 60,
    numericalPercentage: 25,
    theoryPercentage: 15,
    averageDifficulty: "Medium-Hard",
  },
  recommendations: [
    "Focus heavily on Mechanics and Electromagnetism - they comprise 35% of questions",
    "Practice numerical problems from Thermodynamics",
    "Modern Physics is trending upward in recent years",
    "Allocate 40% of study time to top 3 topics",
  ],
};

export const mockSyllabusData = {
  subject: "Computer Science",
  course: "Data Structures and Algorithms",
  units: [
    {
      id: "unit1",
      title: "Introduction to Data Structures",
      topics: [
        { id: "t1", name: "Arrays and Strings", hours: 4, completed: false },
        { id: "t2", name: "Linked Lists", hours: 6, completed: false },
        { id: "t3", name: "Stacks and Queues", hours: 4, completed: false },
      ],
    },
    {
      id: "unit2",
      title: "Trees and Graphs",
      topics: [
        { id: "t4", name: "Binary Trees", hours: 5, completed: false },
        { id: "t5", name: "Binary Search Trees", hours: 4, completed: false },
        { id: "t6", name: "Graph Representation", hours: 4, completed: false },
        { id: "t7", name: "Graph Traversals", hours: 5, completed: false },
      ],
    },
    {
      id: "unit3",
      title: "Sorting and Searching",
      topics: [
        { id: "t8", name: "Basic Sorting Algorithms", hours: 4, completed: false },
        { id: "t9", name: "Advanced Sorting", hours: 5, completed: false },
        { id: "t10", name: "Searching Algorithms", hours: 3, completed: false },
      ],
    },
    {
      id: "unit4",
      title: "Advanced Topics",
      topics: [
        { id: "t11", name: "Dynamic Programming", hours: 8, completed: false },
        { id: "t12", name: "Greedy Algorithms", hours: 5, completed: false },
        { id: "t13", name: "Hashing", hours: 4, completed: false },
      ],
    },
  ],
  totalHours: 61,
};

export const mockStudyPlan = {
  startDate: "2024-03-01",
  endDate: "2024-04-15",
  weeklyHours: 20,
  weeks: [
    {
      week: 1,
      focus: "Foundation",
      tasks: [
        { day: "Mon", topic: "Arrays and Strings", duration: 3, type: "study" },
        { day: "Tue", topic: "Arrays Practice", duration: 2, type: "practice" },
        { day: "Wed", topic: "Linked Lists Intro", duration: 3, type: "study" },
        { day: "Thu", topic: "Linked Lists Implementation", duration: 3, type: "practice" },
        { day: "Fri", topic: "Stacks and Queues", duration: 3, type: "study" },
        { day: "Sat", topic: "Week 1 Review", duration: 3, type: "review" },
        { day: "Sun", topic: "Practice Quiz", duration: 2, type: "quiz" },
      ],
    },
    {
      week: 2,
      focus: "Trees",
      tasks: [
        { day: "Mon", topic: "Binary Trees Basics", duration: 3, type: "study" },
        { day: "Tue", topic: "Tree Traversals", duration: 3, type: "practice" },
        { day: "Wed", topic: "Binary Search Trees", duration: 3, type: "study" },
        { day: "Thu", topic: "BST Operations", duration: 3, type: "practice" },
        { day: "Fri", topic: "AVL Trees Introduction", duration: 3, type: "study" },
        { day: "Sat", topic: "Week 2 Review", duration: 3, type: "review" },
        { day: "Sun", topic: "Practice Quiz", duration: 2, type: "quiz" },
      ],
    },
  ],
};

export const mockQuizQuestions = [
  {
    id: 1,
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctAnswer: 1,
    explanation: "Binary search divides the search interval in half with each step, resulting in logarithmic time complexity.",
    topic: "Searching Algorithms",
  },
  {
    id: 2,
    question: "Which data structure uses LIFO (Last In First Out) principle?",
    options: ["Queue", "Stack", "Linked List", "Tree"],
    correctAnswer: 1,
    explanation: "A stack follows the LIFO principle where the last element added is the first one to be removed.",
    topic: "Data Structures",
  },
  {
    id: 3,
    question: "What is the worst-case time complexity of Quick Sort?",
    options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"],
    correctAnswer: 2,
    explanation: "Quick Sort has O(n²) worst-case complexity when the pivot selection is poor (e.g., already sorted array).",
    topic: "Sorting Algorithms",
  },
  {
    id: 4,
    question: "Which traversal of a BST gives nodes in sorted order?",
    options: ["Preorder", "Postorder", "Inorder", "Level order"],
    correctAnswer: 2,
    explanation: "Inorder traversal of a BST visits nodes in ascending order: left subtree, root, right subtree.",
    topic: "Trees",
  },
  {
    id: 5,
    question: "What is the space complexity of merge sort?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: 2,
    explanation: "Merge sort requires O(n) auxiliary space for the temporary arrays used during merging.",
    topic: "Sorting Algorithms",
  },
];

export const mockDashboardData = {
  overallProgress: 42,
  studyStreak: 7,
  totalHoursStudied: 28,
  quizzesCompleted: 12,
  averageQuizScore: 78,
  topicsCompleted: 8,
  totalTopics: 20,
  weeklyActivity: [
    { day: "Mon", hours: 3 },
    { day: "Tue", hours: 4 },
    { day: "Wed", hours: 2 },
    { day: "Thu", hours: 5 },
    { day: "Fri", hours: 3 },
    { day: "Sat", hours: 6 },
    { day: "Sun", hours: 4 },
  ],
  recentActivity: [
    { type: "quiz", title: "Data Structures Quiz", score: 85, date: "2024-03-08" },
    { type: "study", title: "Binary Search Trees", duration: 45, date: "2024-03-07" },
    { type: "concept", title: "Reviewed: Hash Tables", date: "2024-03-07" },
    { type: "quiz", title: "Sorting Algorithms", score: 72, date: "2024-03-06" },
  ],
  upcomingTasks: [
    { title: "Graph Traversals", type: "study", dueDate: "2024-03-10" },
    { title: "Trees Quiz", type: "quiz", dueDate: "2024-03-11" },
    { title: "Dynamic Programming", type: "study", dueDate: "2024-03-12" },
  ],
};

export const mockLibraryItems = [
  {
    id: "lib_001",
    type: "lesson",
    title: "Introduction to Neural Networks",
    subject: "Computer Science",
    createdAt: "2024-03-05",
    thumbnail: "/thumbnails/neural.png",
  },
  {
    id: "lib_002",
    type: "document",
    title: "Physics PYQ Analysis 2020-2024",
    subject: "Physics",
    createdAt: "2024-03-03",
    thumbnail: "/thumbnails/physics.png",
  },
  {
    id: "lib_003",
    type: "quiz",
    title: "Data Structures Practice Quiz",
    subject: "Computer Science",
    score: 85,
    createdAt: "2024-03-02",
  },
  {
    id: "lib_004",
    type: "studyplan",
    title: "March Study Plan - DSA",
    subject: "Computer Science",
    progress: 35,
    createdAt: "2024-03-01",
  },
  {
    id: "lib_005",
    type: "lesson",
    title: "Thermodynamics Fundamentals",
    subject: "Physics",
    createdAt: "2024-02-28",
    thumbnail: "/thumbnails/thermo.png",
  },
];

export const mockChatMessages = [
  {
    id: 1,
    role: "assistant",
    content: "Hello! I'm your AI learning assistant. How can I help you today?",
  },
];

export const mockAIResponses: Record<string, string> = {
  default: "I understand you're asking about that topic. Let me provide some insights based on your current learning context.",
  greeting: "Hello! I'm here to help you with your studies. Feel free to ask me anything about your current topic.",
  explanation: "That's a great question! Let me break it down for you step by step...",
  quiz: "Would you like me to generate some practice questions on this topic?",
};
