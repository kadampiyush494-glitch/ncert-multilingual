import { useRef } from 'react';

type Props = {
  onTextExtracted: (text: string) => void;
};

export function OCRUpload({ onTextExtracted }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 🔍 For now just simulate OCR
    console.log('OCR file:', file.name);

    // TODO: Replace with real OCR later
    onTextExtracted('Extracted text from image (demo)');
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="p-2 text-gray-500 hover:text-gray-700"
        title="Upload image"
      >
        📷
      </button>
    </>
  );
}

