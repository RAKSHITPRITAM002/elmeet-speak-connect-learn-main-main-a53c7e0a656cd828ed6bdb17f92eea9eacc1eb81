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

const COMMON_PHRASES = {
  en: [
    { phrase: 'Hello', meaning: 'A greeting' },
    { phrase: 'Thank you', meaning: 'Expression of gratitude' },
    { phrase: 'Goodbye', meaning: 'A farewell' },
  ],
  es: [
    { phrase: 'Hola', meaning: 'Hello' },
    { phrase: 'Gracias', meaning: 'Thank you' },
    { phrase: 'Adiós', meaning: 'Goodbye' },
  ],
  // Add more languages and phrases as needed
};

export const DictionaryPhrases: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [searchTerm, setSearchTerm] = useState('');
  const { dictionaryEntries, addDictionaryEntry } = useLanguageTools();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      addDictionaryEntry(searchTerm, selectedLanguage);
    }
  };

  const filteredEntries = dictionaryEntries.filter(
    entry => entry.language === selectedLanguage
  );

  const currentPhrases = COMMON_PHRASES[selectedLanguage as keyof typeof COMMON_PHRASES] || [];

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="mb-4">
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {SUPPORTED_LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search dictionary..."
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleSearch}
            disabled={!searchTerm.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Dictionary Entries</h3>
          <div className="space-y-2">
            {filteredEntries.map((entry, index) => (
              <div key={index} className="p-2 border rounded">
                <div className="font-medium">{entry.word}</div>
                <div className="text-gray-600">{entry.meaning}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Common Phrases</h3>
          <div className="space-y-2">
            {currentPhrases.map((phrase, index) => (
              <div key={index} className="p-2 border rounded">
                <div className="font-medium">{phrase.phrase}</div>
                <div className="text-gray-600">{phrase.meaning}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 