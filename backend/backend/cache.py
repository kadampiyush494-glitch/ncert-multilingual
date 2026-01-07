from functools import lru_cache
from backend.rag import search

@lru_cache(maxsize=100)
def cached_search(question: str):
    return search(question)