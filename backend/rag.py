import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from pypdf.errors import PdfStreamError

# ---------------- CONFIG ----------------
DATA_DIR = "data"
INDEX_DIR = "embeddings"

# ---------------- EMBEDDINGS ----------------
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# ---------------- CLEAN TEXT ----------------
def clean_text(text: str) -> str:
    lines = text.split("\n")
    clean_lines = [
        line.strip()
        for line in lines
        if line.strip()
        and not any(x in line.lower() for x in [
            "chapter",
            "fig.",
            "figure",
            "page",
            "indd",
            "08-04",
            "india and the contemporary world"
        ])
    ]
    return " ".join(clean_lines)

# ---------------- BUILD INDEX ----------------
def build_index():
    docs = []

    for root, _, files in os.walk(DATA_DIR):
        for file in files:
            if not file.lower().endswith(".pdf"):
                continue

            pdf_path = os.path.join(root, file)
            print(f"📄 Loading {pdf_path}")

            try:
                loader = PyPDFLoader(pdf_path)
                docs.extend(loader.load())
            except PdfStreamError:
                print(f"⚠️ Skipping corrupted PDF: {pdf_path}")
            except Exception as e:
                print(f"⚠️ Error loading {pdf_path}: {e}")

    if not docs:
        raise RuntimeError("❌ No documents loaded")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=80
    )

    chunks = splitter.split_documents(docs)

    db = FAISS.from_documents(chunks, embeddings)
    db.save_local(INDEX_DIR)

    print("✅ FAISS index built successfully")

# ---------------- LOAD INDEX ----------------
def load_index():
    return FAISS.load_local(
        INDEX_DIR,
        embeddings,
        allow_dangerous_deserialization=True
    )

# ---------------- SEARCH ----------------
def search(query: str, k: int = 3):
    db = load_index()
    results = db.similarity_search(query, k=k)

    cleaned_results = [
        clean_text(r.page_content)
        for r in results
    ]

    return cleaned_results