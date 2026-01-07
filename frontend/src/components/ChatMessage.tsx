import { useState } from 'react';
import { ThumbsUp, ThumbsDown, AlertTriangle, MessageSquare, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { ChatMessage as ChatMessageType, ExplanationLevel } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
  onFeedback: (messageId: string, type: 'helpful' | 'incorrect' | 'wrong-language', comment?: string) => void;
  onRegenerateWithLevel?: (level: ExplanationLevel) => void;
}

export function ChatMessage({ message, onFeedback, onRegenerateWithLevel }: ChatMessageProps) {
  const [showCitations, setShowCitations] = useState(false);
  const [showFeedbackComment, setShowFeedbackComment] = useState(false);
  const [feedbackComment, setFeedbackComment] = useState('');

  const handleFeedback = (type: 'helpful' | 'incorrect' | 'wrong-language') => {
    if (showFeedbackComment && feedbackComment.trim()) {
      onFeedback(message.id, type, feedbackComment);
      setFeedbackComment('');
      setShowFeedbackComment(false);
    } else {
      onFeedback(message.id, type);
    }
  };

  const getConfidenceColor = () => {
    if (!message.confidence) return '';
    switch (message.confidence) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-red-500';
    }
  };

  const getConfidencePercentage = () => {
    if (!message.confidence) return 0;
    switch (message.confidence) {
      case 'high': return 92;
      case 'medium': return 68;
      case 'low': return 45;
    }
  };

  if (message.role === 'user') {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%] md:max-w-[60%]">
          <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-5 py-3 shadow-md">
            <p className="text-sm md:text-base whitespace-pre-wrap">{message.content}</p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[90%] md:max-w-[75%]">
        <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {message.isOutOfScope ? (
            <div className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-2">
                    Out of Scope
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {message.content}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="p-5">
                <p className="text-sm md:text-base text-gray-800 dark:text-gray-200 whitespace-pre-wrap mb-4">
                  {message.content}
                </p>

                {message.confidence && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Confidence</span>
                      <span className="text-xs font-medium text-gray-900 dark:text-white">
                        {getConfidencePercentage()}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getConfidenceColor()} transition-all`}
                        style={{ width: `${getConfidencePercentage()}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Model is {getConfidencePercentage()}% confident in this answer
                    </p>
                  </div>
                )}

                {message.citations && message.citations.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <button
                      onClick={() => setShowCitations(!showCitations)}
                      className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>View Citations ({message.citations.length})</span>
                      {showCitations ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {showCitations && (
                      <div className="mt-3 space-y-2">
                        {message.citations.map((citation, idx) => (
                          <div
                            key={idx}
                            className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800"
                          >
                            <div className="flex items-start gap-2 mb-2">
                              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {citation.book}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  {citation.chapter} • Page {citation.page}
                                </p>
                              </div>
                            </div>
                            <p className="text-xs text-gray-700 dark:text-gray-300 italic pl-6">
                              "{citation.excerpt}"
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {onRegenerateWithLevel && !message.isOutOfScope && (
                  <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => onRegenerateWithLevel('simple')}
                      className="flex-1 px-3 py-2 text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                    >
                      Simple
                    </button>
                    <button
                      onClick={() => onRegenerateWithLevel('standard')}
                      className="flex-1 px-3 py-2 text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                    >
                      Standard
                    </button>
                    <button
                      onClick={() => onRegenerateWithLevel('deep')}
                      className="flex-1 px-3 py-2 text-xs font-medium text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                    >
                      Deep
                    </button>
                  </div>
                )}
              </div>

              {!message.feedbackGiven && (
                <div className="bg-gray-50 dark:bg-gray-900 px-5 py-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Was this helpful?</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleFeedback('helpful')}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 dark:text-green-400 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      Helpful
                    </button>
                    <button
                      onClick={() => handleFeedback('incorrect')}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors"
                    >
                      <ThumbsDown className="w-3 h-3" />
                      Incorrect
                    </button>
                    <button
                      onClick={() => handleFeedback('wrong-language')}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-orange-700 dark:text-orange-400 bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      Wrong Language
                    </button>
                    <button
                      onClick={() => setShowFeedbackComment(!showFeedbackComment)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors"
                    >
                      <MessageSquare className="w-3 h-3" />
                      Comment
                    </button>
                  </div>

                  {showFeedbackComment && (
                    <div className="mt-3">
                      <textarea
                        value={feedbackComment}
                        onChange={(e) => setFeedbackComment(e.target.value)}
                        placeholder="Add your feedback..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                        rows={2}
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
