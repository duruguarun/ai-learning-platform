import os
import uuid
import shutil
from pathlib import Path
from typing import List

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from utils.pdf_parser import extract_multiple_pdfs, combine_papers_for_analysis
from crew import run_analysis_crew

# ── App Setup ──────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Exam Paper Analyser API",
    description="Upload previous question papers and get AI-powered analysis using local Mistral LLM",
    version="1.0.0",
)

# ── CORS — Allow frontend (any origin during dev) ──────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],           # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Upload directory ───────────────────────────────────────────────────────────
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


# ── Health Check ───────────────────────────────────────────────────────────────
@app.get("/health")
async def health_check():
    """Check if the API is running."""
    return {"status": "ok", "message": "Exam Analyser API is running"}


# ── Main Analysis Endpoint ─────────────────────────────────────────────────────
@app.post("/analyse", summary="Upload question papers and get full analysis")
async def analyse_papers(
    files: List[UploadFile] = File(
        ...,
        description="Upload one or more previous question paper PDFs"
    )
):
    """
    Upload previous question paper PDFs.
    
    Returns:
    - **frequent_questions**: Questions that repeat across papers
    - **ranked_topics**: Topics ranked by probability of appearing
    - **paper_pattern**: Structure and format analysis
    - **important_topics_summary**: Key topics for exam preparation
    """

    # ── Validate uploads ────────────────────────────────────────────────────
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")

    if len(files) > 10:
        raise HTTPException(
            status_code=400,
            detail="Maximum 10 papers allowed per request"
        )

    for f in files:
        if not f.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail=f"File '{f.filename}' is not a PDF. Only PDFs are accepted."
            )

    # ── Save uploaded files temporarily ─────────────────────────────────────
    session_id = str(uuid.uuid4())[:8]
    session_dir = UPLOAD_DIR / session_id
    session_dir.mkdir(parents=True, exist_ok=True)

    saved_paths = []
    try:
        for upload in files:
            dest = session_dir / upload.filename
            with open(dest, "wb") as f:
                content = await upload.read()
                f.write(content)
            saved_paths.append(str(dest))
            print(f"Saved: {dest}")

        # ── Extract text from PDFs ───────────────────────────────────────────
        print(f"\n📄 Extracting text from {len(saved_paths)} PDFs...")
        papers_dict = extract_multiple_pdfs(saved_paths)

        if not papers_dict:
            raise HTTPException(
                status_code=422,
                detail="Could not extract text from any of the uploaded PDFs. "
                       "Ensure PDFs are not scanned images without OCR."
            )

        print(f"✅ Successfully extracted text from {len(papers_dict)} papers")

        # ── Combine and run CrewAI pipeline ─────────────────────────────────
        combined_text = combine_papers_for_analysis(papers_dict)
        result = run_analysis_crew(combined_text, num_papers=len(papers_dict))

        return JSONResponse(content=result)

    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR during analysis: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )
    finally:
        # ── Cleanup temp files ───────────────────────────────────────────────
        if session_dir.exists():
            shutil.rmtree(session_dir)
            print(f"🧹 Cleaned up session {session_id}")


# ── Run directly ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
