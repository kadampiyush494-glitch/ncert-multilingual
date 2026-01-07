export async function askNCERT(
  question: string,
  language = 'English',
  mode = 'simple'
) {
  const res = await fetch('http://127.0.0.1:8000/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, language, mode }),
  });

  return res.json();
}