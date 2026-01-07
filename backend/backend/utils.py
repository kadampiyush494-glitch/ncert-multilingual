import re


def clean_text(text: str) -> str:
    if not text:
        return ""

    lower = text.lower()

    # ❌ remove phone / office junk
    if "phone" in lower or "office" in lower or "publication" in lower:
        return ""

    # normalize whitespace
    text = re.sub(r'\s+', ' ', text).strip()

    # ✅ ALLOW DEFINITIONS EVEN IF SHORT
    definition_keywords = [
        "law", "states", "definition",
        "proportional", "pressure",
        "solubility", "gas", "liquid"
    ]

    if len(text) < 40:
        if not any(k in lower for k in definition_keywords):
            return ""

    return text


def format_answer(text: str, mode: str = "simple") -> str:
    """
    Formats the final answer for frontend.
    """

    if not text:
        return ""

    if mode == "exam":
        return f"📌 Exam Answer:\n{text}"

    # default simple
    return f"🔹 Simple Explanation:\n{text}"