import React, { useState } from "react";
import Tesseract from "tesseract.js";

const OCRTesseract: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const runOCR = async () => {
    if (!image) return;

    setLoading(true);
    setText("");
    setProgress(0);

    const result = await Tesseract.recognize(image, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          setProgress(Math.round(m.progress * 100));
        }
      },
    });

    setText(result.data.text);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-5 border rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-3">OCR (Image to Text)</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-3"
      />

      <button
        onClick={runOCR}
        disabled={!image || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Processing..." : "Extract Text"}
      </button>

      {loading && (
        <p className="text-sm mt-2 text-gray-600">
          OCR Progress: {progress}%
        </p>
      )}

      <textarea
        className="w-full mt-4 border rounded p-2"
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Extracted text will appear here..."
      />
    </div>
  );
};

export default OCRTesseract;
