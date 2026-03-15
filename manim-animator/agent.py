"""
Manim Animation Agent
---------------------
LangGraph pipeline:  generate_code → run_manim → [retry ≤2] → done
"""

import os, re, sys, subprocess, tempfile, shutil
from pathlib import Path
from typing import TypedDict, Optional
from langgraph.graph import StateGraph, END
from llm import get_llm

OUTPUT_DIR = Path(__file__).parent / "outputs"
OUTPUT_DIR.mkdir(exist_ok=True)

# ── Prompts ─────────────────────────────────────────────────────────────────────
GENERATE_PROMPT = """\
You are a world-class educational animator who creates Manim videos for ANY audience —
kindergarten kids, school students, college students, engineers, or professionals.

Your job: look at the topic, understand what kind of topic it is, then build the
most effective visual explanation possible using Manim shapes and animations.

TOPIC: {topic}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — UNDERSTAND THE TOPIC TYPE AND PICK A VISUAL STRATEGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Read the topic and decide which category it falls into, then follow that visual strategy:

[A] SIMPLE / EVERYDAY CONCEPT  (kids, general audience)
    Examples: What is rain? How do plants grow? What is gravity?
    Visual strategy:
    - Use large friendly shapes (big circles, squares, arrows)
    - Show cause and effect with moving objects
    - Example: rain = blue Dot objects falling from a cloud shape (arc of dots)
    - Use bright colors, simple labels, slow animations

[B] MATH / NUMBERS / LOGIC  (school students)
    Examples: Addition, Fractions, Prime numbers, Pythagorean theorem
    Visual strategy:
    - Show numbers as counted objects (squares, dots in groups)
    - Use Rectangle bars for comparisons and ratios
    - Example: fractions = Rectangle split into colored sections
    - Show before and after transformations

[C] SCIENCE / PHYSICS / CHEMISTRY / BIOLOGY  (school to college)
    Examples: Photosynthesis, Newton laws, Electric circuits, Cell division
    Visual strategy:
    - Draw a labeled diagram with Rectangle boxes and Text labels
    - Animate the process as a flow: A to B to C with Arrow objects
    - Example: circuit = Rectangle boxes connected by Lines, Dot moving along Line
    - Use color changes to show state changes

[D] COMPUTER SCIENCE / DATA STRUCTURES / ALGORITHMS  (CS students)
    Examples: Stack, Queue, Binary Tree, Sorting, Recursion, Linked List
    Visual strategy:
    - Draw the actual data structure with Rectangle or Circle nodes
    - Animate every operation step by step using .animate.shift()
    - Highlight active elements with .animate.set_color()
    - Show connections between nodes with Arrow objects

[E] ENGINEERING / TECHNICAL / NETWORKING  (BTech, professionals)
    Examples: OSI model, TCP/IP, CPU pipeline, HTTP request
    Visual strategy:
    - Draw layered block diagrams using Rectangle boxes arranged vertically
    - Use Arrow to show data flow between blocks
    - Animate a colored Dot travelling along Lines to show data/signal movement

[F] HISTORY / PROCESS / TIMELINE  (general)
    Examples: How democracy works, Steps of digestion
    Visual strategy:
    - Draw a horizontal timeline using a Line
    - Each event = a labeled Circle appearing left to right
    - Use Arrow to show cause and effect

[G] BUSINESS / ECONOMICS / SOCIAL  (general)
    Examples: Supply and demand, What is inflation
    Visual strategy:
    - Use bar charts made from Rectangles growing upward using .animate
    - Show comparisons side by side with different colored rectangles

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — BUILD THE VIDEO WITH THESE MANIM TOOLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SHAPES: Rectangle, Square, Circle, Arrow, Line, Dot, Triangle, Arc
TEXT:   Text("label", font_size=32, color=WHITE)  ← ONLY Text(), never MathTex/Tex
GROUPS: VGroup(a,b).arrange(DOWN, buff=0.4)

COLORS: BLUE, BLUE_B, BLUE_C, GREEN, GREEN_B, GREEN_C,
        RED, RED_B, YELLOW, YELLOW_B, ORANGE, PURPLE,
        WHITE, GRAY, TEAL, GOLD, PINK

ANIMATIONS:
  self.play(Create(shape))
  self.play(Write(text_obj))
  self.play(FadeIn(obj))
  self.play(FadeOut(obj))
  self.play(DrawBorderThenFill(obj))
  self.play(obj.animate.shift(RIGHT*2))
  self.play(obj.animate.move_to([x, y, 0]))
  self.play(obj.animate.set_color(RED))
  self.play(obj.animate.scale(1.5))
  self.play(obj.animate.set_fill(BLUE, 0.8))
  self.play(Transform(obj_a, obj_b))
  self.play(Indicate(obj))
  self.play(FadeIn(obj, shift=UP*0.3))
  self.play(FadeOut(obj, shift=DOWN*0.3))
  self.wait(N)
  self.play(FadeOut(a), FadeOut(b), FadeOut(c))

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — REQUIRED VIDEO STRUCTURE (total ~60 seconds)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Scene 1 — Title card  (6 sec)
  - Large Text of topic name centered, smaller subtitle below
  - Write(title) → FadeIn(subtitle) → wait(3) → FadeOut both

Scene 2 — What is it?  (12 sec)
  - One line definition text at top
  - Draw a VISUAL DIAGRAM using shapes — do NOT just show more text
  - Label every part with Text
  - wait, then FadeOut everything

Scene 3 — Core idea or first operation  (15 sec)
  - Text heading for this section
  - ANIMATE the main concept — objects must MOVE, APPEAR, CHANGE COLOR
  - Use .animate.shift() or .animate.move_to() for movement
  - wait, then FadeOut everything

Scene 4 — Second part or real example  (15 sec)
  - Another operation or concrete real-world example
  - Objects must animate and move — not just appear statically
  - wait, then FadeOut everything

Scene 5 — Key takeaways  (10 sec)
  - 3 short Text bullet points appearing one by one, each different color
  - End with topic title fading back in briefly
  - Final FadeOut of everything

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STRICT TECHNICAL RULES — EVERY RULE MUST BE FOLLOWED:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Class name must be EXACTLY: ExplainerScene
2. Only one import: from manim import *
3. NEVER use MathTex() or Tex() — use Text() for everything
4. NEVER use self.clear() — use self.play(FadeOut(obj1), FadeOut(obj2)) instead
5. ALL objects must stay within: x in [-6, 6],  y in [-3.5, 3.5]
6. At least 60% of scenes must have animated shapes moving or changing
7. Total runtime ~60 seconds using self.wait() calls
8. Return ONLY raw Python code — no markdown fences, no explanations

Now write the complete Manim script for topic: {topic}
"""

FIX_PROMPT = """\
The Manim script below failed. Fix ONLY what is broken.

ERROR:
{error}

BROKEN CODE:
{code}

Fix rules:
- Keep class name ExplainerScene
- Keep all visual elements (shapes, arrows, rectangles) — do NOT simplify to text-only
- Only use Text(), never MathTex() or Tex()
- Do NOT use self.clear()
- Keep all objects within x: -6..6, y: -3.5..3.5
- Return ONLY the fixed Python code, no markdown fences
"""


# ── State ────────────────────────────────────────────────────────────────────────
class State(TypedDict):
    topic:      str
    code:       str
    video_path: Optional[str]
    error:      Optional[str]
    attempts:   int


# ── Helpers ──────────────────────────────────────────────────────────────────────
def _strip_fences(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^```(?:python)?\s*\n?", "", text)
    text = re.sub(r"\n?\s*```\s*$", "", text)
    return text.strip()

def _find_mp4(search_dir: str) -> Optional[str]:
    for root, _d, files in os.walk(search_dir):
        for f in files:
            if f.endswith(".mp4"):
                return os.path.join(root, f)
    return None

def _safe_del(path):
    try: os.unlink(path)
    except: pass


# ── Node 1: generate code ─────────────────────────────────────────────────────────
def generate_code(state: State) -> State:
    llm = get_llm()
    if state["attempts"] > 0 and state["error"] and state["code"]:
        prompt = FIX_PROMPT.format(error=state["error"], code=state["code"])
        print(f"[agent] attempt {state['attempts']+1}: fixing error...")
    else:
        prompt = GENERATE_PROMPT.format(topic=state["topic"])
        print(f"[agent] attempt 1: generating code for '{state['topic']}'...")

    code = _strip_fences(get_llm().invoke(prompt).content)
    print(f"[agent] code length: {len(code)} chars")
    return {**state, "code": code, "error": None}


# ── Node 2: run manim ─────────────────────────────────────────────────────────────
def run_manim(state: State) -> State:
    attempts = state["attempts"]
    tmp = tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False,
                                     prefix="manim_", encoding="utf-8")
    tmp.write(state["code"]); tmp.close()
    media_dir = os.path.join(os.path.dirname(tmp.name), "manim_media")

    cmd = [sys.executable, "-m", "manim", "-ql",
           "--media_dir", media_dir, tmp.name, "ExplainerScene"]
    print(f"[agent] running: {' '.join(cmd)}")

    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        print(f"[agent] exit code: {r.returncode}")

        if r.returncode != 0:
            err = (r.stderr or r.stdout or "no output")[-3000:]
            _safe_del(tmp.name)
            return {**state, "video_path": None, "error": err, "attempts": attempts+1}

        mp4 = _find_mp4(media_dir)
        if not mp4:
            _safe_del(tmp.name); shutil.rmtree(media_dir, ignore_errors=True)
            return {**state, "video_path": None,
                    "error": "Manim ran OK but no .mp4 produced.", "attempts": attempts+1}

        safe = re.sub(r"[^a-zA-Z0-9_]", "_", state["topic"])[:40]
        dest = str(OUTPUT_DIR / f"{safe}_v{attempts}.mp4")
        shutil.copy2(mp4, dest)
        print(f"[agent] saved → {dest}")

        _safe_del(tmp.name); shutil.rmtree(media_dir, ignore_errors=True)
        return {**state, "video_path": dest, "error": None}

    except subprocess.TimeoutExpired:
        _safe_del(tmp.name)
        return {**state, "video_path": None,
                "error": "Render timed out (>5 min).", "attempts": attempts+1}
    except Exception as e:
        _safe_del(tmp.name)
        return {**state, "video_path": None, "error": str(e), "attempts": attempts+1}


# ── Router ────────────────────────────────────────────────────────────────────────
def route(state: State) -> str:
    if state.get("video_path"): return "done"
    if state["attempts"] < 2:   return "retry"
    return "done"


# ── Build agent ───────────────────────────────────────────────────────────────────
def build_agent():
    g = StateGraph(State)
    g.add_node("generate_code", generate_code)
    g.add_node("run_manim",     run_manim)
    g.set_entry_point("generate_code")
    g.add_edge("generate_code", "run_manim")
    g.add_conditional_edges("run_manim", route, {"retry": "generate_code", "done": END})
    return g.compile()

def run_animation(topic: str) -> dict:
    return build_agent().invoke(
        {"topic": topic, "code": "", "video_path": None, "error": None, "attempts": 0}
    )
