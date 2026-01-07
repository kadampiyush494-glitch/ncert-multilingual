export type Grade = '5' | '6' | '7' | '8' | '9' | '10';

export type Subject = 'Math' | 'Science' | 'Social Science' | 'English' | 'Hindi' | 'Urdu';

export type Language = 'English' | 'Hindi' | 'Urdu' | 'Tamil' | 'Telugu' | 'Marathi' | 'Bengali';

export type UserRole = 'student' | 'admin';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type ExplanationLevel = 'simple' | 'standard' | 'deep';

export interface User {
  name?: string;
  role: UserRole;
  grade?: Grade;
  preferredLanguage: Language;
  preferredSubject?: Subject;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  confidence?: ConfidenceLevel;
  citations?: Citation[];
  isOutOfScope?: boolean;
  feedbackGiven?: boolean;
}

export interface Citation {
  book: string;
  chapter: string;
  page: number;
  excerpt: string;
}

export interface Feedback {
  messageId: string;
  type: 'helpful' | 'incorrect' | 'wrong-language';
  comment?: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  grade: Grade;
  subject: Subject;
  language: Language;
}

export interface AnalyticsData {
  avgLatency: number;
  accuracy: number;
  groundedAnswers: number;
  failedQueries: number;
  totalQueries: number;
  languageUsage: Record<Language, number>;
  subjectUsage: Record<Subject, number>;
}
