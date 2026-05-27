# Agent Guide

This repository is an AI learning platform prototype. Treat it as three connected parts:

1. A Next.js frontend in the repository root.
2. A FastAPI/CrewAI exam paper analyser in `exam-analyser/`.
3. A FastAPI/LangGraph/Manim animation generator in `manim-animator/`.

Use this file as the quick context map before editing.

## Product Shape

The app is branded mostly as `LearnFlow`. It helps students upload study material, analyse previous-year question papers, generate study plans, take quizzes, chat with an AI tutor, and generate educational animations.

The current frontend is largely a polished prototype. Most data is mocked, except:

- PYQ analysis calls `http://localhost:8000/analyse`.
- Animation generation calls `http://localhost:8001`.

## Frontend

Stack:

- Next.js 16 App Router
- React 19
- TypeScript strict mode
- Tailwind CSS 4
- Radix UI components
- Zustand persisted state
- Framer Motion
- Lucide icons

Important files:

- `app/page.tsx` - landing page.
- `app/workspace/page.tsx` - feature workspace shell and right-side AI/tips panel.
- `app/features/page.tsx` - feature picker.
- `app/login/page.tsx` - mock login/signup flow.
- `app/onboarding/page.tsx` - onboarding flow.
- `components/modules/` - main learning feature modules.
- `components/panels/AIChatPanel.tsx` - mock AI tutor UI.
- `lib/services/api.ts` - all mock APIs plus localhost backend calls.
- `lib/store/useAppStore.ts` - global app state with persisted slices.
- `lib/mock/mockData.ts` - static sample responses.

Frontend behavior notes:

- Authentication is mocked in `authAPI`; tokens are fake and persisted in Zustand.
- Chat, concept explanation, quizzes, syllabus parsing, study plans, dashboard data, and uploads are mock/simulated unless explicitly wired otherwise.
- `PYQModule` expects a real backend on port `8000`.
- `SimulationModule` has simple built-in interactive demos and an AI video generator that expects a real backend on port `8001`.
- `next.config.mjs` currently sets `typescript.ignoreBuildErrors = true`; do not rely on this as proof the code is type-safe.
- `app/layout.tsx` imports `Geist` and `Geist_Mono` from `next/font/google`; production builds need network access to Google Fonts unless fonts are replaced with local/system fonts.

Useful frontend checks:

```powershell
npm run lint
npm run build
npx tsc --noEmit
```

If `npm` is unavailable in the Codex desktop environment, use the bundled Node executable and local binaries:

```powershell
& 'C:\Users\HP\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\node_modules\typescript\bin\tsc --noEmit
& 'C:\Users\HP\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\node_modules\next\dist\bin\next build
```

Known frontend issues as of this guide:

- `components/modules/PYQModule.tsx` has strict TypeScript implicit `any` errors around mapped analysis values.
- `next build` may fail in restricted-network environments because Google fonts cannot be fetched.

## Exam Analyser Service

Location: `exam-analyser/`

Purpose:

- Accept one or more PDF question papers.
- Extract text.
- Run a CrewAI multi-agent analysis pipeline.
- Return paper pattern, topic rankings, frequent questions, summary, and raw agent outputs.

Important files:

- `exam-analyser/main.py` - FastAPI app, `/health`, `/analyse`.
- `exam-analyser/crew.py` - CrewAI orchestration and JSON parsing fallback.
- `exam-analyser/agents/agents.py` - agent definitions and Ollama LLM config.
- `exam-analyser/agents/tasks.py` - CrewAI task prompts.
- `exam-analyser/utils/pdf_parser.py` - PDF text extraction helpers.
- `exam-analyser/requirements.txt` - actual Python dependencies.
- `exam-analyser/README.md` - service run instructions.

Run locally:

```powershell
cd exam-analyser
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Also run Ollama separately:

```powershell
ollama serve
```

Model notes:

- The README mentions `mistral`.
- The code currently uses `ollama/ministral-3:latest` in `agents/agents.py`.
- Align docs and code before assuming a model exists locally.

Known service issue:

- `exam-analyser/pyproject.toml` says `requires-python = ">=3.14"`, while the README recommends Python 3.10/3.11. Prefer `requirements.txt` and README unless intentionally updating package metadata.

## Manim Animator Service

Location: `manim-animator/`

Purpose:

- Accept a topic.
- Generate Manim code with an LLM.
- Render a video.
- Expose status polling and video download endpoints.

Important files:

- `manim-animator/main.py` - FastAPI app, job lifecycle, `/generate`, `/status/{job_id}`, `/video/{job_id}`, `/health`.
- `manim-animator/agent.py` - LangGraph pipeline: generate code, run Manim, retry.
- `manim-animator/llm.py` - local Ollama or production Groq LLM selection.
- `manim-animator/requirements.txt` - Python dependencies.
- `manim-animator/outputs/` - generated videos, if present.

Run locally:

```powershell
cd manim-animator
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

Environment behavior:

- Default/development mode uses Ollama.
- `APP_ENV=production` uses Groq and requires `GROQ_API_KEY`.
- Default Ollama model is `ministral-3:latest`.

## Integration Map

Frontend to exam analyser:

- File: `lib/services/api.ts`
- API object: `pyqAPI`
- Endpoint: `POST http://localhost:8000/analyse`
- Consumed by: `components/modules/PYQModule.tsx`

Frontend to animator:

- File: `lib/services/api.ts`
- API object: `animationAPI`
- Endpoints:
  - `POST http://localhost:8001/generate`
  - `GET http://localhost:8001/status/{jobId}`
  - `GET http://localhost:8001/video/{jobId}`
  - `GET http://localhost:8001/health`
- Consumed by: `components/modules/SimulationModule.tsx`

## Development Guidance

- Prefer existing UI components from `components/ui/`.
- Prefer existing services in `lib/services/api.ts` instead of creating ad hoc fetches inside components.
- Keep prototype/mock behavior clear. If replacing mocks with real APIs, update both `api.ts` and affected UI loading/error states.
- Maintain strict TypeScript. Do not use `any` unless there is a specific boundary reason; define local response types for backend payloads.
- Avoid changing unrelated generated UI files in `components/ui/`.
- Be careful with persisted Zustand state. Shape changes may affect existing browser local storage.
- Do not assume both Python services are running when developing frontend features; show graceful offline/error states.
- Avoid committing generated artifacts such as `.next/`, `node_modules/`, service `uploads/`, and generated animation videos.

## Verification Checklist

For frontend changes:

```powershell
npx tsc --noEmit
npm run build
```

For exam analyser changes:

```powershell
cd exam-analyser
python -m py_compile main.py crew.py agents\agents.py agents\tasks.py utils\pdf_parser.py
```

For animator changes:

```powershell
cd manim-animator
python -m py_compile main.py agent.py llm.py
```

For end-to-end local testing:

1. Start Ollama.
2. Start exam analyser on port `8000`.
3. Start animator on port `8001`.
4. Start Next.js on port `3000`.
5. Test `/workspace?feature=pyq` with a PDF.
6. Test `/workspace?feature=simulation`, AI Video tab, with a short topic.

## Current Risk Areas

- Build reproducibility: Google font fetch can break offline/restricted builds.
- Type safety: `PYQModule` needs typed analysis payloads.
- Backend configuration drift: docs and code disagree on Ollama model and Python version.
- Security: CORS allows all origins in both Python services; acceptable for local dev, not production.
- State/auth: auth is not real; do not treat persisted token as secure.
- Long-running jobs: Manim jobs are kept in in-memory process state, so restart loses job status.
