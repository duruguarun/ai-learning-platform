from crewai import Agent, LLM

# ── Shared Ollama LLM ──────────────────────────────────────────────────────────
# CrewAI's native LLM wrapper — uses "ollama/" prefix to route to local Ollama
# Make sure Ollama is running: `ollama serve`
# And Mistral is pulled: `ollama pull mistral`

def get_llm():
    return LLM(
        model="ollama/mistral",
        base_url="http://localhost:11434",
        temperature=0.2,
    )


# ── Agent 1: Pattern Analyst ───────────────────────────────────────────────────
def create_pattern_analyst(llm) -> Agent:
    return Agent(
        role="Question Paper Pattern Analyst",
        goal=(
            "Analyse the structure and format of question papers. "
            "Identify sections, number of questions, marks distribution, "
            "question types (MCQ, short answer, essay, numerical), and "
            "overall exam pattern."
        ),
        backstory=(
            "You are an expert academic analyst with 15 years of experience "
            "studying university exam patterns. You can instantly identify "
            "how an exam is structured just by reading the question paper."
        ),
        llm=llm,
        verbose=False,
        allow_delegation=False,
    )


# ── Agent 2: Topic Extractor & Ranker ─────────────────────────────────────────
def create_topic_ranker(llm) -> Agent:
    return Agent(
        role="Academic Topic Expert and Ranker",
        goal=(
            "Extract all topics and subtopics from the question papers. "
            "Count how often each topic appears across different papers. "
            "Rank topics by importance and calculate probability of each "
            "topic appearing in the next exam."
        ),
        backstory=(
            "You are a seasoned academic coach who has helped thousands of "
            "students prepare for exams. You have a sharp eye for identifying "
            "which topics professors love to test repeatedly."
        ),
        llm=llm,
        verbose=False,
        allow_delegation=False,
    )


# ── Agent 3: FAQ Generator ────────────────────────────────────────────────────
def create_faq_generator(llm) -> Agent:
    return Agent(
        role="Frequently Asked Questions Specialist",
        goal=(
            "Identify questions that appear repeatedly across multiple question "
            "papers (either verbatim or paraphrased). List these as 'frequently "
            "asked questions' with the count of how many times they appeared "
            "and which years/papers they were in."
        ),
        backstory=(
            "You are a meticulous exam researcher who tracks question patterns "
            "across years. You can spot when the same concept is being tested "
            "even if the wording changes slightly."
        ),
        llm=llm,
        verbose=False,
        allow_delegation=False,
    )


# ── Agent 4: Report Compiler ──────────────────────────────────────────────────
def create_report_compiler(llm) -> Agent:
    return Agent(
        role="Academic Insights Report Compiler",
        goal=(
            "Compile all findings from the pattern analyst, topic ranker, and "
            "FAQ specialist into a clear, structured JSON report. The report "
            "must include: paper pattern summary, ranked topics with probability "
            "percentages, frequently asked questions, and key insights for students."
        ),
        backstory=(
            "You are a precise technical writer who turns complex analysis into "
            "clean, structured data that is easy for students to understand and act on."
        ),
        llm=llm,
        verbose=False,
        allow_delegation=False,
    )
