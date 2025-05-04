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

export const GrammarTool: React.FC = () => {
  const { state, checkGrammar, setCurrentLanguage } = useLanguageTools();
  const [text, setText] = useState('');

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      await checkGrammar(text, state.currentLanguage);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Grammar Check</h3>
      
      <form onSubmit={handleCheck} className="space-y-4">
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
          <label className="block text-sm font-medium mb-1">Text to Check</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border rounded"
            rows={6}
            placeholder="Enter text to check grammar..."
          />
        </div>

        <button
          type="submit"
          disabled={state.isCheckingGrammar || !text.trim()}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {state.isCheckingGrammar ? 'Checking...' : 'Check Grammar'}
        </button>
      </form>

      <div className="mt-6">
        <h4 className="font-medium mb-2">Recent Checks</h4>
        <div className="space-y-4">
          {/* TODO: Display recent grammar checks */}
        </div>
      </div>
    </div>
  );
}; 