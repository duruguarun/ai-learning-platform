# 📚 Exam Paper Analyser — Local AI with CrewAI + Ollama Mistral

An agentic AI pipeline that analyses previous question papers and gives students:
- ✅ Frequently asked questions
- ✅ Topic rankings with probability of appearing
- ✅ Question paper pattern analysis
- ✅ Important topics summary

**Runs 100% locally — no OpenAI API key, no cost.**

---

## 🖥️ System Requirements

| Item | Minimum | Recommended |
|------|---------|-------------|
| RAM  | 8GB     | 16GB        |
| OS   | Windows/macOS/Linux | Any |
| Python | 3.10+ | 3.11+ |

---

## ⚙️ Step 1: Install Ollama

### Windows / macOS
Download from: https://ollama.com/download

### Linux
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

---

## 🤖 Step 2: Pull Mistral Model

```bash
# This downloads ~4GB — do this once
ollama pull mistral
```

To verify it works:
```bash
ollama run mistral "Hello, who are you?"
```

---

## 🐍 Step 3: Set Up Python Environment

```bash
# Create a virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

---

## 🚀 Step 4: Run the API

Make sure Ollama is running first:
```bash
# In a separate terminal
ollama serve
```

Then start the FastAPI server:
```bash
python main.py
```

Or with uvicorn directly:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at: **http://localhost:8000**

---

## 📖 API Documentation

FastAPI auto-generates docs at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 📡 API Endpoints

### `GET /health`
Check if the API is running.

**Response:**
```json
{"status": "ok", "message": "Exam Analyser API is running"}
```

---

### `POST /analyse`
Upload question paper PDFs for analysis.

**Request:** `multipart/form-data`
- `files`: One or more PDF files (max 10)

**Example with curl:**
```bash
curl -X POST "http://localhost:8000/analyse" \
  -F "files=@paper2022.pdf" \
  -F "files=@paper2023.pdf" \
  -F "files=@paper2024.pdf"
```

**Example with JavaScript (for frontend dev):**
```javascript
const formData = new FormData();
formData.append('files', file1);
formData.append('files', file2);

const response = await fetch('http://localhost:8000/analyse', {
  method: 'POST',
  body: formData,
});
const result = await response.json();
```

**Response Schema:**
```json
{
  "status": "success",
  "papers_analysed": 3,
  "paper_pattern": {
    "total_questions": 50,
    "sections": [
      {"name": "Part A", "questions": 10, "marks_per_q": 2, "total_marks": 20}
    ],
    "total_marks": 100,
    "common_question_types": ["MCQ", "Short Answer", "Essay"],
    "pattern_summary": "The exam consistently has 3 parts..."
  },
  "ranked_topics": [
    {
      "rank": 1,
      "topic": "Data Structures",
      "frequency": 12,
      "probability_percent": 95.0,
      "reasoning": "Appears in every paper across all years"
    }
  ],
  "frequent_questions": [
    {
      "question": "Explain the difference between stack and queue",
      "frequency": 3,
      "years_appeared": ["2022.pdf", "2023.pdf", "2024.pdf"]
    }
  ],
  "important_topics_summary": "Focus heavily on Data Structures and Algorithms..."
}
```

---

## 🏗️ Architecture

```
Student uploads PDFs via frontend
         ↓
    FastAPI (main.py)
         ↓
    PDF Parser (utils/pdf_parser.py)
         ↓
    CrewAI Pipeline (crew.py)
    ┌────┴────────────────────┐
    ↓                         ↓
Agent 1: Pattern Analyst   Agent 2: Topic Ranker
    ↓                         ↓
Agent 3: FAQ Generator  →  Agent 4: Report Compiler
                              ↓
                      Structured JSON Response
```

All agents use **Mistral 7B via Ollama** — running locally on your machine.

---

## ⚠️ Troubleshooting

**"Connection refused" on port 11434**
→ Ollama isn't running. Start it with `ollama serve`

**Analysis takes very long**
→ Normal for local LLMs. Mistral on CPU takes 2-5 min per analysis. 
→ With a GPU it's much faster.

**"Could not extract text from PDFs"**
→ Your PDFs might be scanned images. You'll need OCR preprocessing.
→ Try: `pip install pytesseract` and add OCR in `utils/pdf_parser.py`

**Out of memory**
→ Try `ollama pull mistral:7b-instruct-q4_0` (smaller quantised version)
