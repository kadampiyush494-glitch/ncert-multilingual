import { OCRUpload } from '../components/OCRUpload';
import { VoiceInput } from '../components/VoiceInput';
import { Volume2, VolumeX } from 'lucide-react';
import { Send, X, Image as ImageIcon, Trash2, Clock } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ChatMessage as ChatMessageComponent } from '../components/ChatMessage';


import { ChatMessage as ChatMessageType, Grade, Subject, Language, ChatSession, ExplanationLevel } from '../types';
import { askNCERT } from '../services/api';

export function Chat(){

  const { user } = useAuth();

  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const [selectedGrade, setSelectedGrade] = useState<Grade>(user?.grade || '8');
  const [selectedSubject, setSelectedSubject] = useState<Subject>(user?.preferredSubject || 'Science');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(user?.preferredLanguage || 'English');
  const [voiceEnabled, setVoiceEnabled] = useState(true);


  const [sessions] = useState<ChatSession[]>([]);

 

  const messagesEndRef = useRef<HTMLDivElement>(null);


  const grades: Grade[] = ['5', '6', '7', '8', '9', '10'];
  const subjects: Subject[] = ['Math', 'Science', 'Social Science', 'English', 'Hindi', 'Urdu'];
  const languages: Language[] = ['English', 'Hindi', 'Urdu', 'Tamil', 'Telugu', 'Marathi', 'Bengali'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateMockResponse = (question: string): ChatMessageType => {
    const isOutOfScope = question.toLowerCase().includes('cricket') || question.toLowerCase().includes('movie');

    if (isOutOfScope) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'This question is outside the NCERT syllabus. Please ask questions related to your grade curriculum topics like Mathematics, Science, or Social Science.',
        timestamp: new Date(),
        isOutOfScope: true,
        feedbackGiven: false,
      };
    }

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `This is a demonstration response to: "${question}"\n\nIn a production system, this would connect to the OPEA-based RAG pipeline to:\n1. Retrieve relevant content from NCERT textbooks\n2. Generate contextual answers\n3. Provide proper citations\n\nThe answer would be generated based on the selected grade (${selectedGrade}), subject (${selectedSubject}), and language (${selectedLanguage}).`,
      timestamp: new Date(),
      confidence: 'high',
      citations: [
        {
          book: `NCERT Grade ${selectedGrade} ${selectedSubject}`,
          chapter: 'Chapter 1: Introduction',
          page: 12,
          excerpt: 'This is a sample excerpt from the textbook that supports the answer provided above.',
        },
      ],
      feedbackGiven: false,
    };
  };



 


   const speakText = (text: string) => {
  if (!voiceEnabled || !window.speechSynthesis) return;

  const utterance = new SpeechSynthesisUtterance(text);

  const langMap: Record<string, string> = {
    English: 'en-US',
    Hindi: 'hi-IN',
    Urdu: 'ur-PK',
    Tamil: 'ta-IN',
    Telugu: 'te-IN',
    Marathi: 'mr-IN',
    Bengali: 'bn-IN',
  };

  utterance.lang = langMap[selectedLanguage] || 'en-US';
  utterance.rate = 1;
  utterance.pitch = 1;

  window.speechSynthesis.cancel(); // stop previous speech
  window.speechSynthesis.speak(utterance);
};



  const handleSend = async () => {
  if (!input.trim()) return;

  setIsLoading(true);
  setError(null);

  try {
    const answers = await askNCERT(input);

    const aiMessage: ChatMessageType = {
  id: Date.now().toString(),
  role: "assistant",
  content:
    answers.answers.length > 0
      ? answers.answers
          .map((a: any) => a.answer)
          .join("\n\n")
      : "No answer found",
  timestamp: new Date(),
  feedbackGiven: false,
};
    setMessages(prev => [...prev, aiMessage]);
    speakText(aiMessage.content);

  } catch {
    setError("Backend unavailable. Showing demo answer.");
    setMessages(prev => [...prev, generateMockResponse(input)]);
  } finally {
    setIsLoading(false);
  }
};






  const handleFeedback = (
  messageId: string,
  type: 'helpful' | 'incorrect' | 'wrong-language',
  comment?: string
) => {
  setMessages(prev =>
    prev.map(msg =>
      msg.id === messageId
        ? {
            ...msg,
            feedbackGiven: true,
            feedbackType: type,       // ✅ USE IT
            feedbackComment: comment, // ✅ OPTIONAL
          }
        : msg
    )
  );
};


  const handleRegenerateWithLevel = (level: ExplanationLevel) => {
    console.log('Regenerate with level:', level);
  };

  const clearChat = () => {
    if (messages.length > 0 && confirm('Clear all messages?')) {
      setMessages([]);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-gray-50 dark:bg-gray-900">
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:relative md:translate-x-0 z-30 w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 h-full overflow-y-auto`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Learning Context</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Grade
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value as Grade)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {grades.map((g) => (
                  <option key={g} value={g}>Grade {g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value as Subject)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {languages.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-6 border border-blue-200 dark:border-blue-800">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">AI Understanding</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-medium rounded">
                  {selectedLanguage}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-medium rounded">
                  {selectedSubject}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs font-medium rounded">
                  Grade {selectedGrade}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Chat History
            </h3>
            {sessions.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No previous sessions</p>
            ) : (
              <div className="space-y-2">
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {session.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className="flex items-center gap-2">
  {/* 🔊 AI Voice Toggle */}
  <button
    onClick={() => setVoiceEnabled(v => !v)}
    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
    title={voiceEnabled ? 'Mute AI voice' : 'Enable AI voice'}
  >
    {voiceEnabled ? (
      <Volume2 className="w-5 h-5 text-blue-600" />
    ) : (
      <VolumeX className="w-5 h-5 text-gray-500" />
    )}
  </button>

  {/* 🗑 Clear Chat */}
  <button
    onClick={clearChat}
    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
  >
    <Trash2 className="w-4 h-4" />
    <span className="hidden sm:inline">Clear Chat</span>
  </button>
</div>


        <div className="flex-1 overflow-y-auto p-4 md:p-6">
           {/* LOADING */}
  {isLoading && (
    <p className="text-gray-500 dark:text-gray-400 mb-2">Thinking...</p>
  )}

  {error && (
    <div className="mb-2 rounded-lg bg-red-100 text-red-700 px-4 py-2 text-sm">
      {error}
    </div>
  )}

  {messages.length === 0 ? (

            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Ready to Learn?
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Ask any question from your NCERT textbooks and get instant, verified answers with citations.
                </p>
                <div className="grid grid-cols-1 gap-2 text-left">
                  {[
                    'What is photosynthesis?',
                    'Explain Pythagoras theorem',
                    'Who wrote the Indian Constitution?',
                    'What is the formula for Gravtaional Force?',
                  ].map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(suggestion)}
                      className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {messages.map((message) => (
                <ChatMessageComponent
                  key={message.id}
                  message={message}
                  onFeedback={handleFeedback}
                  onRegenerateWithLevel={handleRegenerateWithLevel}
                />
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm shadow-lg border border-gray-200 dark:border-gray-700 px-5 py-3">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                {/* ✅ OCR Upload (image → text) */}
                 <OCRUpload onTextExtracted={(text: string) => setInput(text)} />
             <textarea
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }}
  placeholder="Ask your doubt here from the NCERT..."
  className="w-full px-4 py-3 pr-24 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
  rows={1}
/>

<div className="absolute right-2 bottom-2 flex gap-1">
  {/* ✅ VOICE INPUT BUTTON */}
  <VoiceInput
    selectedLanguage={selectedLanguage}
    onTranscript={(text) =>
      setInput(prev => (prev ? prev + ' ' + text : text))
    }
   
  />

  <button
    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
    title="Upload image"
  >
    <ImageIcon className="w-5 h-5" />
  </button>
</div>
  
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl transition-all disabled:cursor-not-allowed flex items-center gap-2 font-medium"
              >
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
     </div>
    
  );
  
}


