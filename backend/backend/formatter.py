def format_answer(text: str, mode: str) -> str:
    if mode == "exam":
        return (
            "📝 Exam Ready Answer:\n\n"
            f"{text}\n\n"
            "✔ Definition based\n"
            "✔ Suitable for exams"
        )

    return f"📘 Simple Explanation:\n\n{text}"