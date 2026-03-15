import json
import re
from dotenv import load_dotenv
load_dotenv()
from crewai import Crew, Process

from agents.agents import (
    get_llm,
    create_pattern_analyst,
    create_topic_ranker,
    create_faq_generator,
    create_report_compiler,
)
from agents.tasks import (
    create_pattern_task,
    create_topic_ranking_task,
    create_faq_task,
    create_compilation_task,
)


def run_analysis_crew(papers_text: str, num_papers: int) -> dict:
    """
    Runs the full CrewAI agentic pipeline on the extracted paper text.
    Returns a structured dict with the full analysis report.
    """

    print("\n🚀 Initialising CrewAI pipeline with Mistral via Ollama...\n")

    # ── Initialise LLM ──────────────────────────────────────────────────────
    llm = get_llm()

    # ── Create Agents ───────────────────────────────────────────────────────
    pattern_agent   = create_pattern_analyst(llm)
    topic_agent     = create_topic_ranker(llm)
    faq_agent       = create_faq_generator(llm)
    compiler_agent  = create_report_compiler(llm)

    # ── Create Tasks ────────────────────────────────────────────────────────
    pattern_task  = create_pattern_task(pattern_agent, papers_text)
    topic_task    = create_topic_ranking_task(topic_agent, papers_text)
    faq_task      = create_faq_task(faq_agent, papers_text)

    # Compiler sees results of all previous tasks as context
    compile_task  = create_compilation_task(compiler_agent, papers_text)
    compile_task.context = [pattern_task, topic_task, faq_task]

    # ── Assemble Crew ───────────────────────────────────────────────────────
    crew = Crew(
        agents=[pattern_agent, topic_agent, faq_agent, compiler_agent],
        tasks=[pattern_task, topic_task, faq_task, compile_task],
        process=Process.sequential,   # Each agent waits for previous to finish
        verbose=True,
    )

    # ── Clear previous agent outputs so we can collect fresh ones ------------
    from crewai.memory.storage.kickoff_task_outputs_storage import KickoffTaskOutputsSQLiteStorage
    storage = KickoffTaskOutputsSQLiteStorage()
    try:
        storage.delete_all()
    except Exception:
        pass  # ignore if file not present yet

    # ── Run the Pipeline ────────────────────────────────────────────────────
    print("🤖 Starting multi-agent analysis...\n")
    result = crew.kickoff()

    # ── Parse the JSON output from the compiler agent ───────────────────────
    raw_output = str(result)
    parsed = _safe_parse_json(raw_output)

    # ── Read individual agent/task outputs stored by Crew --------------------
    agent_outputs: list[dict] = []
    try:
        records = storage.load()
        for rec in records:
            agent_outputs.append({
                "task_index": rec.get("task_index"),
                "output": rec.get("output"),
            })
    except Exception:
        agent_outputs = []

    if parsed:
        parsed["papers_analysed"] = num_papers
        parsed["status"] = "success"
        parsed["agent_outputs"] = agent_outputs
    else:
        # Fallback: return raw output if JSON parsing fails
        parsed = {
            "status": "partial",
            "papers_analysed": num_papers,
            "raw_insights": raw_output,
            "message": "Analysis completed but JSON formatting failed. Raw insights included.",
            "agent_outputs": agent_outputs,
        }

    return parsed


def _safe_parse_json(text: str) -> dict | None:
    """
    Try multiple strategies to extract valid JSON from LLM output.
    LLMs sometimes wrap JSON in markdown code blocks.
    """
    # Strategy 1: Direct parse
    try:
        return json.loads(text.strip())
    except json.JSONDecodeError:
        pass

    # Strategy 2: Extract from ```json ... ``` blocks
    match = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
    if match:
        try:
            return json.loads(match.group(1).strip())
        except json.JSONDecodeError:
            pass

    # Strategy 3: Find first { ... } block
    match = re.search(r"\{[\s\S]*\}", text)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            pass

    return None
