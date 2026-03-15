import os
from pathlib import Path
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv(dotenv_path=Path(__file__).parent / ".env")

def get_llm() -> ChatOpenAI:
    api_key = os.getenv("OPENROUTER_API_KEY")
    model   = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini")
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY missing in .env")
    return ChatOpenAI(
        api_key=api_key,
        base_url="https://openrouter.ai/api/v1",
        model=model,
        temperature=0.2,
    )
