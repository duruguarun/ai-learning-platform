import os
from dotenv import load_dotenv

load_dotenv()


def get_llm():
    app_env = os.getenv("APP_ENV", "development").strip().lower()

    if app_env == "production":
        from langchain_groq import ChatGroq

        api_key = os.getenv("GROQ_API_KEY")
        model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

        if not api_key:
            raise ValueError("GROQ_API_KEY missing in .env for production mode")

        return ChatGroq(
            groq_api_key=api_key,
            model_name=model,
            temperature=0,
            max_retries=2,
        )

    else:
        from langchain_ollama import ChatOllama

        model = os.getenv("OLLAMA_MODEL", "ministral-3:latest")
        base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

        return ChatOllama(
            model=model,
            base_url=base_url,
            temperature=0,
        )