from pydantic import BaseModel
from typing import List, Optional


class FrequentQuestion(BaseModel):
    question: str
    frequency: int          # How many times it appeared across papers
    years_appeared: List[str]


class TopicRank(BaseModel):
    topic: str
    rank: int
    probability_percent: float   # e.g. 85.0 means 85% chance of appearing
    frequency: int
    reasoning: str


class QuestionPaperPattern(BaseModel):
    total_questions: int
    sections: List[dict]         # e.g. [{"name": "Part A", "questions": 10, "marks": 2}]
    total_marks: int
    common_question_types: List[str]   # MCQ, short answer, essay, etc.
    pattern_summary: str


class AnalysisReport(BaseModel):
    status: str
    papers_analysed: int
    frequent_questions: List[FrequentQuestion]
    ranked_topics: List[TopicRank]
    paper_pattern: QuestionPaperPattern
    important_topics_summary: str
    raw_insights: Optional[str] = None


class AnalysisError(BaseModel):
    status: str = "error"
    message: str
