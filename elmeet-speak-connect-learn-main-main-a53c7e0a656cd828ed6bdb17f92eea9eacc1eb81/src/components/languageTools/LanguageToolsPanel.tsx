import React, { useState } from 'react';
import { TranslationTool } from './TranslationTool';
import { DictionaryTool } from './DictionaryTool';
import { GrammarTool } from './GrammarTool';
import { PronunciationTool } from './PronunciationTool';
import { CharacterPad } from './CharacterPad';
import { DictionaryPhrases } from './DictionaryPhrases';
import { Annotation } from './Annotation';

type ToolType = 'translation' | 'dictionary' | 'grammar' | 'pronunciation' | 'characterPad' | 'dictionaryPhrases' | 'annotation';

export const LanguageToolsPanel: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>('translation');

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Language Tools</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTool('translation')}
            className={`px-3 py-1 rounded ${activeTool === 'translation' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Translation
          </button>
          <button
            onClick={() => setActiveTool('dictionary')}
            className={`px-3 py-1 rounded ${activeTool === 'dictionary' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Dictionary
          </button>
          <button
            onClick={() => setActiveTool('grammar')}
            className={`px-3 py-1 rounded ${activeTool === 'grammar' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Grammar
          </button>
          <button
            onClick={() => setActiveTool('pronunciation')}
            className={`px-3 py-1 rounded ${activeTool === 'pronunciation' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Pronunciation
          </button>
          <button
            onClick={() => setActiveTool('characterPad')}
            className={`px-3 py-1 rounded ${activeTool === 'characterPad' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Character Pad
          </button>
          <button
            onClick={() => setActiveTool('dictionaryPhrases')}
            className={`px-3 py-1 rounded ${activeTool === 'dictionaryPhrases' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Phrases
          </button>
          <button
            onClick={() => setActiveTool('annotation')}
            className={`px-3 py-1 rounded ${activeTool === 'annotation' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Annotation
          </button>
        </div>
      </div>

      <div className="mt-4">
        {activeTool === 'translation' && <TranslationTool />}
        {activeTool === 'dictionary' && <DictionaryTool />}
        {activeTool === 'grammar' && <GrammarTool />}
        {activeTool === 'pronunciation' && <PronunciationTool />}
        {activeTool === 'characterPad' && <CharacterPad />}
        {activeTool === 'dictionaryPhrases' && <DictionaryPhrases />}
        {activeTool === 'annotation' && <Annotation />}
      </div>
    </div>
  );
}; 