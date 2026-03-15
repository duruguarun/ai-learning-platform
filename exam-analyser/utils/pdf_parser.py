import pdfplumber
import fitz  # PyMuPDF
from pathlib import Path
from typing import List, Dict


def extract_text_pdfplumber(pdf_path: str) -> str:
    """Primary extraction using pdfplumber (handles tables well)."""
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n\n"
    except Exception as e:
        print(f"pdfplumber failed for {pdf_path}: {e}")
    return text.strip()


def extract_text_pymupdf(pdf_path: str) -> str:
    """Fallback extraction using PyMuPDF."""
    text = ""
    try:
        doc = fitz.open(pdf_path)
        for page in doc:
            text += page.get_text() + "\n\n"
        doc.close()
    except Exception as e:
        print(f"PyMuPDF failed for {pdf_path}: {e}")
    return text.strip()


def extract_pdf_text(pdf_path: str) -> str:
    """Try pdfplumber first, fallback to PyMuPDF."""
    text = extract_text_pdfplumber(pdf_path)
    if not text or len(text) < 100:
        print(f"Falling back to PyMuPDF for {pdf_path}")
        text = extract_text_pymupdf(pdf_path)
    return text


def extract_multiple_pdfs(pdf_paths: List[str]) -> Dict[str, str]:
    """
    Extract text from multiple PDFs.
    Returns dict: { filename: extracted_text }
    """
    results = {}
    for path in pdf_paths:
        filename = Path(path).name
        print(f"Extracting: {filename}")
        text = extract_pdf_text(path)
        if text:
            results[filename] = text
        else:
            print(f"WARNING: No text extracted from {filename}")
    return results


def combine_papers_for_analysis(papers: Dict[str, str]) -> str:
    """
    Combine all paper texts into one structured string for the LLM.
    Labels each paper clearly so the model knows boundaries.
    """
    combined = ""
    for i, (filename, text) in enumerate(papers.items(), 1):
        combined += f"\n{'='*60}\n"
        combined += f"QUESTION PAPER {i}: {filename}\n"
        combined += f"{'='*60}\n"
        combined += text + "\n"
    return combined
