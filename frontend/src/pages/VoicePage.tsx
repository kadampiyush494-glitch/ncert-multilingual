import { useState } from 'react';
import { VoiceInput } from '../components/VoiceInput';
import { Language } from '../types';



export function VoicePage() {
  const [text, setText] = useState('');
 const [language, setLanguage] = useState<Language>('English');


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Voice Input Demo
      </h1>

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}

        className="mb-4 px-3 py-2 border rounded-lg"
      >
        <option>English</option>
        <option>Hindi</option>
      </select>

      <VoiceInput
        selectedLanguage={language}
        onTranscript={(text) =>
          setText((prev) => (prev ? prev + ' ' + text : text))
        }
      />

      <textarea
        value={text}
        readOnly
        className="mt-6 w-full max-w-xl p-4 border rounded-lg"
        rows={4}
        placeholder="Spoken text will appear here..."
      />
    </div>
  );
}
