import os
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

PDF_DIR = "data/ncert_pdfs"
INDEX_DIR = "embeddings/faiss_index"

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

def build_index():
    docs = []

    for file in os.listdir(PDF_DIR):
        if file.endswith(".pdf"):
            loader = PyPDFLoader(os.path.join(PDF_DIR, file))
            docs.extend(loader.load())

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100
    )

    chunks = splitter.split_documents(docs)

    vectorstore = FAISS.from_documents(chunks, embeddings)
    vectorstore.save_local(INDEX_DIR)

    return "Index created successfully"


def load_index():
    return FAISS.load_local(
        INDEX_DIR,
        embeddings,
        allow_dangerous_deserialization=True
    )

def search(query: str, k: int = 3):
    db = load_index()
    results = db.similarity_search(query, k=k)
    return [r.page_content for r in results]

from functools import lru_cache

@lru_cache(maxsize=1000)
def cached_search(query: str):
    db = load_index()
    return db.similarity_search(query, k=3)