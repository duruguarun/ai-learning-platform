# AI Platform

A modern, feature-rich AI-powered learning platform built with Next.js, React, and TypeScript. This platform provides an interactive educational experience with AI chat integration, workflow builders, and comprehensive learning modules.

## 📋 Table of Contents

- [Features](#features)
- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Setup & Configuration](#setup--configuration)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Available Scripts](#available-scripts)

---

## ✨ Features

### Core Features
- **Dashboard** - Central hub for analytics and quick access
- **Workspace** - Personalized learning environment
- **AI Chat Panel** - Real-time AI assistant for queries and learning support
- **Recommendation Panel** - Personalized course and content recommendations
- **Workflow Builder** - Create and manage custom learning workflows

### Learning Modules
- **Concept Module** - Learn fundamental concepts with structured content
- **Study Plan Module** - Organize and track your study schedule
- **Syllabus Module** - Browse course syllabus and learning objectives
- **Quiz Module** - Test your knowledge with interactive quizzes
- **PYQ Module** - Access Previous Year Questions for exam preparation
- **File Upload Module** - Upload and manage study materials
- **Simulation Module** - Interactive simulations for practical learning

### Additional Features
- **User Authentication** - Secure login and onboarding system
- **Content Viewer** - Rich media content display
- **Theme Support** - Dark/Light mode toggle
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Form Management** - Robust form handling with validation

---

## 📦 System Requirements

### Minimum Requirements
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or **pnpm**: v8.0.0 or higher)
- **Git**: For version control

### Recommended Environment
- **OS**: Windows 10/11, macOS, or Linux
- **RAM**: 4GB minimum (8GB recommended)
- **Disk Space**: 2GB for node_modules and project files
- **Browser**: Chrome/Firefox/Edge/Safari (latest version)

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd ai-platform
```

### Step 2: Install Dependencies

Using **pnpm** :
```bash
pnpm install
```

Or using **npm** (recommended):
```bash
npm install
```

Or using **yarn**:
```bash
yarn install
```

---

## ⚙️ Setup & Configuration

### Environment Variables

Create a `.env.local` file in the root directory (if needed for API endpoints):

```bash
# Example .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
# Add other environment variables as needed
```

### Project Configuration

The project uses the following configuration files:

**tsconfig.json** - TypeScript configuration with path aliases:
- `@/*` - Maps to root directory for easy imports

**next.config.mjs** - Next.js configuration:
- TypeScript build errors are ignored
- Image optimization is disabled for static export

**tailwind.config** - Tailwind CSS with Radix UI integration

---

## 🏃 Running the Project

### Development Server

Start the development server with hot reload:

```bash
pnpm dev
```

Or with npm: (recommended)
```bash
npm run dev
```

The application will be available at:
- **Local**: http://localhost:3000
- **Network**: Check terminal output for network URL

### Production Build

Build the project for production:

```bash
pnpm build
```

### Start Production Server

Run the production build:

```bash
pnpm start
```

### Linting

Check code quality and style:

```bash
pnpm lint
```

---

## 📊 Project Structure

```
ai-platform/
├── app/                          # Next.js app directory (routes)
│   ├── dashboard/               # Dashboard page
│   ├── features/                # Features page
│   ├── library/                 # Library page
│   ├── login/                   # Authentication page
│   ├── onboarding/              # Onboarding flow
│   ├── workspace/               # User workspace
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx           # Navigation bar
│   │   └── Sidebar.tsx          # Side navigation
│   ├── modules/                 # Feature modules
│   │   ├── ConceptModule.tsx
│   │   ├── FileUploadModule.tsx
│   │   ├── PYQModule.tsx
│   │   ├── QuizModule.tsx
│   │   ├── SimulationModule.tsx
│   │   ├── StudyPlanModule.tsx
│   │   └── SyllabusModule.tsx
│   ├── panels/
│   │   ├── AIChatPanel.tsx      # AI chat interface
│   │   ├── ContentViewer.tsx    # Content display
│   │   └── RecommendationPanel.tsx
│   ├── workflow/
│   │   ├── WorkflowBuilder.tsx  # Workflow creation
│   │   └── WorkflowStep.tsx
│   ├── ui/                      # Reusable UI components
│   │   └── [...components]      # Radix UI + custom components
│   └── theme-provider.tsx       # Theme management
│
├── hooks/
│   ├── use-mobile.ts            # Mobile detection hook
│   └── use-toast.ts             # Toast notifications hook
│
├── lib/
│   ├── utils.ts                 # Utility functions
│   ├── mock/
│   │   └── mockData.ts          # Mock data for testing
│   ├── services/
│   │   └── api.ts               # API service layer
│   └── store/
│       └── useAppStore.ts       # Global state (Zustand)
│
├── public/                       # Static assets
│   └── images/
│
├── styles/
│   └── globals.css              # Global stylesheets
│
├── next.config.mjs              # Next.js configuration
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.mjs           # PostCSS configuration
├── package.json                 # Project dependencies
├── pnpm-lock.yaml              # Dependency lock file
└── README.md                    # This file
```

---

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 16.1.6** - React framework with SSR/SSG
- **React 19.2.4** - UI library
- **TypeScript 5.7.3** - Type-safe JavaScript

### Styling
- **Tailwind CSS 4.2.0** - Utility-first CSS framework
- **PostCSS** - CSS processing

### UI Components
- **Radix UI** - Headless component library
  - Accordion, Dialog, Dropdown, Select, Tabs, etc.
- **Lucide React** - Icon library

### State Management
- **Zustand 4.5.2** - Lightweight state management
- **React Hook Form 7.54.1** - Form state management

### Data & API
- **Axios 1.6.8** - HTTP client
- **Zod 3.24.1** - Schema validation

### Charts & Visualization
- **Recharts 2.15.0** - React chart library

### Animations & Motion
- **Framer Motion 11.0.25** - Animation library
- **Embla Carousel React 8.6.0** - Carousel component

### Utilities
- **next-themes** - Dark mode support
- **sonner** - Toast notifications
- **vaul** - Drawer component
- **date-fns 4.1.0** - Date utilities
- **clsx** - Conditional classnames
- **tailwind-merge** - Merge Tailwind classes

### Development Tools
- **ESLint** - Code linting
- **Vercel Analytics** - Analytics tracking

---

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint checks |

---

## 🔧 Troubleshooting

### Port 3000 Already in Use
```bash
# Change the port when starting dev server
pnpm dev -- -p 3001
```

### Node Modules Issues
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### TypeScript Errors
The `next.config.mjs` is configured to ignore TypeScript build errors. Clear `.next` folder if issues persist:
```bash
rm -rf .next
pnpm build
```

### Build Fails
```bash
# Clean build
rm -rf .next
pnpm build
```

---

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Radix UI Documentation](https://radix-ui.com)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check existing documentation
- Review the project structure for examples

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Automatic deployment on `main` branch

### Deploy to Other Platforms

Build the project and deploy the `.next` folder:
```bash
pnpm build
# Deploy the .next folder and public folder
```

---

**Happy coding! 🎉**
