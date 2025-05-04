import React, { createContext, useContext, useState, useCallback } from 'react';
import { Translation, DictionaryEntry, GrammarCheck, PronunciationFeedback, LanguageToolState } from '../types/languageTools';

interface LanguageToolsContextType {
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

const LanguageToolsContext = createContext<LanguageToolsContextType | undefined>(undefined);

export const LanguageToolsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [dictionaryEntries, setDictionaryEntries] = useState<DictionaryEntry[]>([]);
  const [grammarChecks, setGrammarChecks] = useState<GrammarCheck[]>([]);
  const [pronunciationFeedback, setPronunciationFeedback] = useState<PronunciationFeedback[]>([]);
  const [state, setState] = useState<LanguageToolState>({
    isTranslating: false,
    isLookingUp: false,
    isCheckingGrammar: false,
    isAnalyzingPronunciation: false,
    selectedLanguage: 'en',
  });

  const addTranslation = useCallback((text: string, fromLang: string, toLang: string) => {
    setState(prev => ({ ...prev, isTranslating: true }));
    // Simulate API call
    setTimeout(() => {
      const newTranslation: Translation = {
        id: Date.now().toString(),
        text,
        fromLang,
        toLang,
        translatedText: `Translated ${text} from ${fromLang} to ${toLang}`,
        timestamp: new Date(),
      };
      setTranslations(prev => [newTranslation, ...prev]);
      setState(prev => ({ ...prev, isTranslating: false }));
    }, 1000);
  }, []);

  const addDictionaryEntry = useCallback((word: string, language: string) => {
    setState(prev => ({ ...prev, isLookingUp: true }));
    // Simulate API call
    setTimeout(() => {
      const newEntry: DictionaryEntry = {
        id: Date.now().toString(),
        word,
        language,
        meaning: `Meaning of ${word} in ${language}`,
        examples: [`Example usage of ${word}`],
        timestamp: new Date(),
      };
      setDictionaryEntries(prev => [newEntry, ...prev]);
      setState(prev => ({ ...prev, isLookingUp: false }));
    }, 1000);
  }, []);

  const addGrammarCheck = useCallback((text: string, language: string) => {
    setState(prev => ({ ...prev, isCheckingGrammar: true }));
    // Simulate API call
    setTimeout(() => {
      const newCheck: GrammarCheck = {
        id: Date.now().toString(),
        text,
        language,
        suggestions: [`Suggestion for ${text}`],
        timestamp: new Date(),
      };
      setGrammarChecks(prev => [newCheck, ...prev]);
      setState(prev => ({ ...prev, isCheckingGrammar: false }));
    }, 1000);
  }, []);

  const addPronunciationFeedback = useCallback((text: string, language: string, audioUrl: string) => {
    setState(prev => ({ ...prev, isAnalyzingPronunciation: true }));
    // Simulate API call
    setTimeout(() => {
      const newFeedback: PronunciationFeedback = {
        id: Date.now().toString(),
        text,
        language,
        audioUrl,
        score: Math.random() * 100,
        feedback: `Pronunciation feedback for ${text}`,
        timestamp: new Date(),
      };
      setPronunciationFeedback(prev => [newFeedback, ...prev]);
      setState(prev => ({ ...prev, isAnalyzingPronunciation: false }));
    }, 1000);
  }, []);

  const clearHistory = useCallback(() => {
    setTranslations([]);
    setDictionaryEntries([]);
    setGrammarChecks([]);
    setPronunciationFeedback([]);
  }, []);

  return (
    <LanguageToolsContext.Provider
      value={{
        translations,
        dictionaryEntries,
        grammarChecks,
        pronunciationFeedback,
        state,
        addTranslation,
        addDictionaryEntry,
        addGrammarCheck,
        addPronunciationFeedback,
        clearHistory,
      }}
    >
      {children}
    </LanguageToolsContext.Provider>
  );
};

export const useLanguageTools = () => {
  const context = useContext(LanguageToolsContext);
  if (!context) {
    throw new Error('useLanguageTools must be used within a LanguageToolsProvider');
  }
  return context;
}; 