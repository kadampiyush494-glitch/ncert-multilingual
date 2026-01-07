import warnings
warnings.filterwarnings("ignore")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.rag import build_index
from backend.translate import to_english, from_english
from backend.utils import clean_text, format_answer
from backend.cache import cached_search

app = FastAPI(title="NCERT RAG Backend")

# ✅ CORS FIX (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- MODELS ----------

class QuestionRequest(BaseModel):
    question: str
    language: str = "English"
    mode: str = "simple"

# ---------- ROUTES ----------

@app.get("/")
def root():
    return {"status": "Backend running"}

@app.post("/ingest")
def ingest():
    msg = build_index()
    return {"message": msg}

@app.post("/ask")
def ask(data: QuestionRequest):

    english_question = to_english(data.question, data.language)
    docs = cached_search(english_question)

    answers = []

    for doc in docs:
        # ✅ THIS IS THE CRASH FIX
        text = doc.page_content if hasattr(doc, "page_content") else doc
        cleaned = clean_text(text)

        if not cleaned:
            continue

        formatted = format_answer(cleaned, data.mode)
        translated = from_english(formatted, data.language)

        answers.append({
            "answer": translated,
            "source": {
                "book": getattr(doc, "metadata", {}).get("book", "NCERT"),
                "chapter": getattr(doc, "metadata", {}).get("chapter", "Unknown"),
                "page": getattr(doc, "metadata", {}).get("page", "?")
            }
        })

    return {
        "question": data.question,
        "answers": answers
    }