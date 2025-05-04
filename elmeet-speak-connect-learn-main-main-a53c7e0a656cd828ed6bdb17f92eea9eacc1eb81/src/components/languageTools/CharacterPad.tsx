import React, { useState } from 'react';
import { useLanguageTools } from '../../contexts/LanguageToolsContext';

const SUPPORTED_SCRIPTS = [
  { code: 'ko', name: 'Korean (한글)' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'zh', name: 'Chinese (中文)' },
  { code: 'hi', name: 'Hindi (हिंदी)' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'ru', name: 'Russian (Русский)' },
];

const KOREAN_KEYBOARD = [
  ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ'],
  ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ'],
  ['ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ'],
];

const JAPANESE_KEYBOARD = [
  ['あ', 'い', 'う', 'え', 'お'],
  ['か', 'き', 'く', 'け', 'こ'],
  ['さ', 'し', 'す', 'せ', 'そ'],
  ['た', 'ち', 'つ', 'て', 'と'],
  ['な', 'に', 'ぬ', 'ね', 'の'],
  ['は', 'ひ', 'ふ', 'へ', 'ほ'],
  ['ま', 'み', 'む', 'め', 'も'],
  ['や', 'ゆ', 'よ'],
  ['ら', 'り', 'る', 'れ', 'ろ'],
  ['わ', 'を', 'ん'],
];

const CHINESE_KEYBOARD = [
  ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
  ['人', '口', '手', '日', '月', '水', '火', '木', '金', '土'],
  ['大', '小', '上', '下', '中', '左', '右', '前', '后', '里'],
];

export const CharacterPad: React.FC = () => {
  const [selectedScript, setSelectedScript] = useState('ko');
  const [inputText, setInputText] = useState('');
  const { addTranslation } = useLanguageTools();

  const handleScriptChange = (script: string) => {
    setSelectedScript(script);
    setInputText('');
  };

  const handleKeyPress = (key: string) => {
    setInputText(prev => prev + key);
  };

  const handleSubmit = () => {
    if (inputText.trim()) {
      addTranslation(inputText, selectedScript, 'en');
      setInputText('');
    }
  };

  const getKeyboardLayout = () => {
    switch (selectedScript) {
      case 'ko':
        return KOREAN_KEYBOARD;
      case 'ja':
        return JAPANESE_KEYBOARD;
      case 'zh':
        return CHINESE_KEYBOARD;
      default:
        return KOREAN_KEYBOARD;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="mb-4">
        <select
          value={selectedScript}
          onChange={(e) => handleScriptChange(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {SUPPORTED_SCRIPTS.map(script => (
            <option key={script.code} value={script.code}>
              {script.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 p-2 border rounded min-h-[50px]">
        {inputText}
      </div>

      <div className="grid grid-cols-10 gap-1">
        {getKeyboardLayout().map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map((key, keyIndex) => (
              <button
                key={`${rowIndex}-${keyIndex}`}
                onClick={() => handleKeyPress(key)}
                className="p-2 border rounded hover:bg-gray-100"
              >
                {key}
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setInputText('')}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Clear
        </button>
        <button
          onClick={handleSubmit}
          disabled={!inputText.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Submit
        </button>
      </div>
    </div>
  );
}; 