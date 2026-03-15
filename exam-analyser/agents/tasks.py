from crewai import Task
from crewai import Agent


def create_pattern_task(agent: Agent, papers_text: str) -> Task:
    return Task(
        description=f"""
Analyse the following question papers and identify the exam pattern.

PAPERS:
{papers_text}

Your analysis must cover:
1. Total number of questions per paper
2. Sections (e.g., Part A, Part B) and their structure
3. Marks per question / marks distribution
4. Types of questions (MCQ, short answer, long answer, numerical, diagram-based)
5. Any consistent patterns you notice across all papers
6. Total marks

Be specific with numbers. If different papers have different patterns, note both 
the common pattern and the variations.
""",
        expected_output=(
            "A detailed structured analysis of the question paper pattern including: "
            "sections, question counts, mark distributions, question types, and a "
            "summary of the overall pattern. Format as clear text with headings."
        ),
        agent=agent,
    )


def create_topic_ranking_task(agent: Agent, papers_text: str) -> Task:
    return Task(
        description=f"""
Extract and rank all topics from the following question papers.

PAPERS:
{papers_text}

Your task:
1. List every topic and subtopic that appears in the papers
2. Count how many times each topic appears across ALL papers combined
3. Calculate a probability percentage (frequency / total questions * 100)
4. Rank topics from most important (rank 1) to least important
5. Add brief reasoning for why each top-10 topic is important

Output the top 15 topics minimum. Include both broad topics and specific subtopics.
""",
        expected_output=(
            "A ranked list of topics with: rank number, topic name, frequency count, "
            "probability percentage, and reasoning. Include at least 15 topics. "
            "Format clearly with each topic on its own section."
        ),
        agent=agent,
    )


def create_faq_task(agent: Agent, papers_text: str) -> Task:
    return Task(
        description=f"""
Identify frequently asked questions from the following question papers.

PAPERS:
{papers_text}

Your task:
1. Find questions that appear in MULTIPLE papers (same or similar wording)
2. Find questions on the SAME concept that repeat across papers
3. For each frequently asked question:
   - Write the question clearly
   - State how many times it appeared (frequency)
   - Note which papers/years it appeared in (use paper filenames as labels)
4. Also list questions that only appeared once but are from very high-frequency topics

Sort by frequency (most repeated first).
""",
        expected_output=(
            "A list of frequently asked questions sorted by frequency. Each entry "
            "should include the question text, frequency count, and which papers "
            "it appeared in. Minimum 10 FAQs identified."
        ),
        agent=agent,
    )


def create_compilation_task(agent: Agent, papers_text: str) -> Task:
    return Task(
        description=f"""
You have received analysis results from three specialist agents. Now compile 
everything into a final structured JSON report.

The JSON must follow EXACTLY this structure:
{{
  "papers_analysed": <number>,
  "paper_pattern": {{
    "total_questions": <number>,
    "sections": [
      {{"name": "Part A", "questions": <n>, "marks_per_q": <n>, "total_marks": <n>}}
    ],
    "total_marks": <number>,
    "common_question_types": ["MCQ", "Short Answer", ...],
    "pattern_summary": "<2-3 sentence summary>"
  }},
  "ranked_topics": [
    {{
      "rank": 1,
      "topic": "<topic name>",
      "frequency": <number>,
      "probability_percent": <number>,
      "reasoning": "<why this topic is important>"
    }}
  ],
  "frequent_questions": [
    {{
      "question": "<question text>",
      "frequency": <number>,
      "years_appeared": ["Paper1.pdf", "Paper2.pdf"]
    }}
  ],
  "important_topics_summary": "<paragraph summarizing key topics for exam prep>"
}}

Return ONLY valid JSON. No markdown, no explanation text outside the JSON.
""",
        expected_output=(
            "Valid JSON string matching the specified structure exactly. "
            "Must include paper_pattern, ranked_topics (min 10), "
            "frequent_questions (min 8), and important_topics_summary."
        ),
        agent=agent,
        context=[],  # Will be filled dynamically in crew.py
    )
