import os
import re
from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()

def get_llm() -> ChatGroq:
    api_key = os.getenv("GROQ_API_KEY")
    model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

    if not api_key:
        raise ValueError("GROQ_API_KEY missing in .env")

    return ChatGroq(
        groq_api_key=api_key,
        model_name=model,
        temperature=0,
        max_retries=2,
    )


def extract_python_code(text: str) -> str:
    if not text:
        return ""

    text = text.strip()

    # Case 1: fenced code block
    fence_match = re.search(r"```(?:python)?\s*(.*?)```", text, re.DOTALL | re.IGNORECASE)
    if fence_match:
        return fence_match.group(1).strip()

    # Case 2: raw code starts from import/class
    lines = text.splitlines()
    start_idx = None

    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith("from manim import") or stripped.startswith("import ") or stripped.startswith("class "):
            start_idx = i
            break

    if start_idx is None:
        return ""

    code = "\n".join(lines[start_idx:]).strip()

    # Remove trailing junk after code if model adds explanation at the end
    junk_markers = [
        "\nExplanation:",
        "\nThis code",
        "\nLet me know",
        "\nNote:",
        "\nHow it works:"
    ]
    for marker in junk_markers:
        idx = code.find(marker)
        if idx != -1:
            code = code[:idx].strip()

    return code


def main():
    llm = get_llm()

    prompt = """
You are generating a Python source file.

Return a complete runnable Manim Community Edition Python script.

Task:
Visualize Bubble Sort for the array [5, 1, 4, 2, 8].

Mandatory requirements:
- Start the file with: from manim import *
- Create exactly one scene class named BubbleSortScene
- Show comparisons visually
- Show swaps visually
- Final sorted array should become green
- Output Python code only

Do not include:
- explanations
- markdown
- think tags
- comments outside Python code
"""

    response = llm.invoke(prompt)

    print("=== FULL RESPONSE ===")
    print(response)
    print()

    raw = response.content if isinstance(response.content, str) else str(response.content)

    print("=== RAW CONTENT ===")
    print(raw)
    print()

    code = extract_python_code(raw)

    print("=== EXTRACTED CODE ===")
    print(code if code else "[EMPTY]")
    print()

    if not code:
        raise ValueError("No Python code could be extracted from model output.")

    with open("generated_bubble_sort_manim.py", "w", encoding="utf-8") as f:
        f.write(code)

    print("Saved to generated_bubble_sort_manim.py")


if __name__ == "__main__":
    main()