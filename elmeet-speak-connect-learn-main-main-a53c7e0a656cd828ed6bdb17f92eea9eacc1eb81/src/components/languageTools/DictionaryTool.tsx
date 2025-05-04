import React, { useState } from 'react';
import { useLanguageTools } from '../../contexts/LanguageToolsContext';

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ko', name: 'Korean' },
];

export const DictionaryTool: React.FC = () => {
  const { state, lookupWord, setCurrentLanguage } = useLanguageTools();
  const [word, setWord] = useState('');

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (word.trim()) {
      await lookupWord(word, state.currentLanguage);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Dictionary</h3>
      
      <form onSubmit={handleLookup} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Language</label>
          <select
            value={state.currentLanguage}
            onChange={(e) => setCurrentLanguage(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Word</label>
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter a word to look up..."
          />
        </div>

        <button
          type="submit"
          disabled={!word.trim()}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Look Up
        </button>
      </form>

      <div className="mt-6">
        <h4 className="font-medium mb-2">Recent Lookups</h4>
        <div className="space-y-4">
          {/* TODO: Display recent dictionary entries */}
        </div>
      </div>
    </div>
  );
}; 