export interface Translation {
  id: string;
  text: string;
  fromLang: string;
  toLang: string;
  translatedText: string;
  timestamp: Date;
}

export interface DictionaryEntry {
  id: string;
  word: string;
  language: string;
  meaning: string;
  examples: string[];
  timestamp: Date;
}

export interface GrammarCheck {
  id: string;
  text: string;
  language: string;
  suggestions: string[];
  timestamp: Date;
}

export interface PronunciationFeedback {
  id: string;
  text: string;
  language: string;
  audioUrl: string;
  score: number;
  feedback: string;
  timestamp: Date;
}

export interface LanguageToolState {
  isTranslating: boolean;
  isLookingUp: boolean;
  isCheckingGrammar: boolean;
  isAnalyzingPronunciation: boolean;
  selectedLanguage: string;
}

export interface LanguageToolsContextType {
  translations: Translation[];
  dictionaryEntries: DictionaryEntry[];
  grammarChecks: GrammarCheck[];
  pronunciationFeedback: PronunciationFeedback[];
  state: LanguageToolState;
  addTranslation: (text: string, fromLang: string, toLang: string) => void;
  addDictionaryEntry: (word: string, language: string) => void;
  addGrammarCheck: (text: string, language: string) => void;
  addPronunciationFeedback: (text: string, language: string, audioUrl: string) => void;
  clearHistory: () => void;
} 