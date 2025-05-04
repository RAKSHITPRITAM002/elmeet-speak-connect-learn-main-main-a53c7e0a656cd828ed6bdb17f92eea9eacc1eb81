import React, { useState, useEffect, useRef } from 'react';
import { RolePlayScenario, RolePlayResponse } from '../../types/roleplay';
import { useRolePlay } from '../../contexts/RolePlayContext';
import { useAuth } from '../../contexts/AuthContext';

interface ActiveScenarioProps {
  scenario: RolePlayScenario;
}

export const ActiveScenario: React.FC<ActiveScenarioProps> = ({ scenario }) => {
  const { state, playScenario, pauseScenario, recordResponse, selectCharacter } = useRolePlay();
  const { user } = useAuth();
  const [currentLine, setCurrentLine] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (state.isPlaying) {
      const timer = setInterval(() => {
        setCurrentLine(prev => {
          if (prev >= scenario.script.length - 1) {
            clearInterval(timer);
            pauseScenario();
            return prev;
          }
          return prev + 1;
        });
      }, 3000); // Change line every 3 seconds
      return () => clearInterval(timer);
    }
  }, [state.isPlaying, scenario.script.length, pauseScenario]);

  useEffect(() => {
    if (audioRef.current && scenario.script[currentLine].audioUrl) {
      audioRef.current.src = scenario.script[currentLine].audioUrl;
      audioRef.current.play();
    }
  }, [currentLine, scenario.script]);

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

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        recordResponse({
          scenarioId: scenario.id,
          userId: user?.id || '',
          characterId: state.selectedCharacter || '',
          text: scenario.script[currentLine].text,
          audioUrl,
        });

        setAudioChunks([]);
        setIsRecording(false);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleCharacterSelect = (characterId: string) => {
    selectCharacter(characterId);
  };

  const currentCharacter = scenario.characters.find(
    char => char.id === scenario.script[currentLine].characterId
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{scenario.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => state.isPlaying ? pauseScenario() : playScenario()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {state.isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={() => endScenario(scenario.id)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            End Scenario
          </button>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-600">{scenario.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {scenario.characters.map(character => (
          <div
            key={character.id}
            className={`p-4 border rounded cursor-pointer ${
              state.selectedCharacter === character.id ? 'border-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => handleCharacterSelect(character.id)}
          >
            <h4 className="font-semibold">{character.name}</h4>
            <p className="text-sm text-gray-600">{character.description}</p>
            <p className="text-sm text-gray-500">Language: {character.language}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <div className="bg-gray-100 p-4 rounded">
          <p className="text-lg">{scenario.script[currentLine].text}</p>
          {currentCharacter && (
            <p className="text-sm text-gray-500 mt-2">
              - {currentCharacter.name}
            </p>
          )}
        </div>
      </div>

      {state.selectedCharacter && (
        <div className="flex justify-center gap-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600"
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
      )}

      <audio ref={audioRef} className="hidden" />
    </div>
  );
}; 