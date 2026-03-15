"""
Manim Animator API
------------------
POST /generate        → start async job, returns job_id
GET  /status/{job_id} → poll job status
GET  /video/{job_id}  → stream the rendered MP4
GET  /health          → health check

Run:
    uvicorn main:app --host 0.0.0.0 --port 8001 --reload
"""

import uuid
import asyncio
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from typing import Literal, Optional

from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

from agent import run_animation

# ── App ────────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Manim Animator API",
    description="Generate educational Manim animation videos from any topic",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── In-memory job store ────────────────────────────────────────────────────────
# { job_id: { status, topic, video_path, error, code } }
jobs: dict[str, dict] = {}

# Thread pool — Manim rendering is CPU-bound / blocking
executor = ThreadPoolExecutor(max_workers=2)

# ── Models ─────────────────────────────────────────────────────────────────────
class GenerateRequest(BaseModel):
    topic: str

class JobStatus(BaseModel):
    job_id:     str
    status:     Literal["queued", "generating", "rendering", "done", "error"]
    topic:      str
    video_url:  Optional[str] = None
    error:      Optional[str] = None
    code:       Optional[str] = None


# ── Background worker ──────────────────────────────────────────────────────────
def _run_job(job_id: str, topic: str):
    """Runs in a thread — calls the LangGraph agent synchronously."""
    try:
        jobs[job_id]["status"] = "generating"
        print(f"[api] job {job_id} started for topic: {topic}")

        result = run_animation(topic)

        if result.get("video_path"):
            jobs[job_id].update({
                "status":     "done",
                "video_path": result["video_path"],
                "code":       result.get("code", ""),
                "error":      None,
            })
            print(f"[api] job {job_id} done → {result['video_path']}")
        else:
            jobs[job_id].update({
                "status": "error",
                "error":  result.get("error", "Unknown error"),
                "code":   result.get("code", ""),
            })
            print(f"[api] job {job_id} failed: {result.get('error')}")

    except Exception as e:
        jobs[job_id].update({"status": "error", "error": str(e)})
        print(f"[api] job {job_id} exception: {e}")


# ── Endpoints ──────────────────────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {"status": "ok", "message": "Manim Animator API is running"}


@app.post("/generate", response_model=JobStatus)
async def generate(req: GenerateRequest, background_tasks: BackgroundTasks):
    topic = req.topic.strip()

    if not topic:
        raise HTTPException(status_code=400, detail="topic cannot be empty")
    if len(topic) > 200:
        raise HTTPException(status_code=400, detail="topic too long (max 200 chars)")

    job_id = str(uuid.uuid4())[:12]
    jobs[job_id] = {
        "status":     "queued",
        "topic":      topic,
        "video_path": None,
        "error":      None,
        "code":       None,
    }

    # Run in background thread so the response returns immediately
    loop = asyncio.get_event_loop()
    loop.run_in_executor(executor, _run_job, job_id, topic)

    print(f"[api] queued job {job_id} for: {topic}")
    return JobStatus(job_id=job_id, status="queued", topic=topic)


@app.get("/status/{job_id}", response_model=JobStatus)
async def status(job_id: str):
    job = jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Job '{job_id}' not found")

    video_url = None
    if job["status"] == "done" and job.get("video_path"):
        video_url = f"/video/{job_id}"

    return JobStatus(
        job_id    = job_id,
        status    = job["status"],
        topic     = job["topic"],
        video_url = video_url,
        error     = job.get("error"),
        code      = job.get("code") if job["status"] == "done" else None,
    )


@app.get("/video/{job_id}")
async def get_video(job_id: str):
    job = jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Job '{job_id}' not found")
    if job["status"] != "done":
        raise HTTPException(status_code=409, detail=f"Job is not done yet (status: {job['status']})")

    video_path = job.get("video_path")
    if not video_path or not Path(video_path).exists():
        raise HTTPException(status_code=404, detail="Video file not found on disk")

    filename = f"{job['topic'].replace(' ', '_')[:40]}.mp4"
    return FileResponse(
        path        = video_path,
        media_type  = "video/mp4",
        filename    = filename,
        headers     = {"Accept-Ranges": "bytes"},
    )


@app.delete("/job/{job_id}")
async def delete_job(job_id: str):
    """Clean up a completed job and its video file."""
    job = jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Job '{job_id}' not found")

    if job.get("video_path"):
        try: Path(job["video_path"]).unlink(missing_ok=True)
        except: pass

    del jobs[job_id]
    return {"message": f"Job '{job_id}' deleted"}


# ── Entry point ────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
