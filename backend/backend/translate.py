from transformers import pipeline

# Load once (slow but safe)
hi_en = pipeline("translation", model="Helsinki-NLP/opus-mt-hi-en")
en_hi = pipeline("translation", model="Helsinki-NLP/opus-mt-en-hi")
en_mr = pipeline("translation", model="Helsinki-NLP/opus-mt-en-mr")

def to_english(text: str, language: str) -> str:
    if language == "Hindi":
        return hi_en(text)[0]["translation_text"]
    return text

def from_english(text: str, language: str) -> str:
    if language == "Hindi":
        return en_hi(text)[0]["translation_text"]
    if language == "Marathi":
        return en_mr(text)[0]["translation_text"]
    return text