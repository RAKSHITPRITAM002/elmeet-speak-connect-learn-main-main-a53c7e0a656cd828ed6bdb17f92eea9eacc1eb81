import React, { useState, useRef } from 'react';
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

export const PronunciationTool: React.FC = () => {
  const { state, recordPronunciation, setCurrentLanguage } = useLanguageTools();
  const [text, setText] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
        }

        await recordPronunciation(text, state.currentLanguage);
        setAudioChunks([]);
      };

      recorder.start();
      setMediaRecorder(recorder);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && state.isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Pronunciation Practice</h3>
      
      <div className="space-y-4">
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
          <label className="block text-sm font-medium mb-1">Text to Practice</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
            placeholder="Enter text to practice pronunciation..."
          />
        </div>

        <div className="flex justify-center gap-4">
          {!state.isRecording ? (
            <button
              onClick={startRecording}
              disabled={!text.trim()}
              className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50"
            >
              Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              Stop Recording
            </button>
          )}
        </div>

        <audio ref={audioRef} className="w-full" controls />
      </div>

      <div className="mt-6">
        <h4 className="font-medium mb-2">Recent Practice</h4>
        <div className="space-y-4">
          {/* TODO: Display recent pronunciation feedback */}
        </div>
      </div>
    </div>
  );
}; 