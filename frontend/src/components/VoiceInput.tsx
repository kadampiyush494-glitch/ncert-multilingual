import { Mic } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Language } from '../types';

interface VoiceInputProps {
  selectedLanguage: Language;
  onTranscript: (text: string) => void;
  onEnd?: () => void; // ✅ CUSTOM PROP (THIS FIXES YOUR ERROR)
}

export function VoiceInput({
  selectedLanguage,
  onTranscript,
  onEnd,
}: VoiceInputProps) {
  const recognitionRef = useRef<any>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    const langMap: Record<string, string> = {
      English: 'en-US',
      Hindi: 'hi-IN',
      Urdu: 'ur-PK',
      Tamil: 'ta-IN',
      Telugu: 'te-IN',
      Marathi: 'mr-IN',
      Bengali: 'bn-IN',
    };

    recognition.lang = langMap[selectedLanguage] || 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
      onEnd?.(); // ✅ AUTO-SEND HOOK
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, [selectedLanguage, onTranscript, onEnd]);

  const toggleMic = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <button
      type="button"
      onClick={toggleMic}
      title="Voice input"
      className={`absolute right-12 bottom-2 p-2 rounded-lg transition
        ${isListening ? 'bg-red-600 text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600'}
      `}
    >
      <Mic className="w-5 h-5" />
    </button>
  );
}

