export const languages = {
  English: {
    label: 'English',
    speechCode: 'en-US',
  },
  Hindi: {
    label: 'Hindi',
    speechCode: 'hi-IN',
  },
  Urdu: {
    label: 'Urdu',
    speechCode: 'ur-PK',
  },
  Tamil: {
    label: 'Tamil',
    speechCode: 'ta-IN',
  },
};

export type SupportedLanguage = keyof typeof languages;

