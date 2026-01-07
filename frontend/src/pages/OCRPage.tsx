import OCRTesseract from "../components/OCRTesseract";

export default function OCRPage({
  onNavigate,
}: {
  onNavigate?: (page: string) => void;
}) {
  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          OCR Scanner
        </h1>

        {/* Back button uses onNavigate */}
        {onNavigate && (
          <button
            onClick={() => onNavigate("chat")}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Back to Chat
          </button>
        )}
      </div>

      {/* OCR Component */}
      <OCRTesseract />
    </div>
  );
}

