import React, { useState } from 'react';
import { RolePlayCharacter } from '../../types/roleplay';
import { useRolePlay } from '../../contexts/RolePlayContext';
import { useAuth } from '../../contexts/AuthContext';

interface CreateScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateScenarioModal: React.FC<CreateScenarioModalProps> = ({ isOpen, onClose }) => {
  const { addScenario } = useRolePlay();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [characters, setCharacters] = useState<RolePlayCharacter[]>([
    { id: crypto.randomUUID(), name: '', description: '', language: 'en' },
    { id: crypto.randomUUID(), name: '', description: '', language: 'en' }
  ]);
  const [script, setScript] = useState<{ id: string; characterId: string; text: string }[]>([
    { id: crypto.randomUUID(), characterId: characters[0].id, text: '' },
    { id: crypto.randomUUID(), characterId: characters[1].id, text: '' }
  ]);

  const handleAddCharacter = () => {
    setCharacters([...characters, {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      language: 'en'
    }]);
  };

  const handleCharacterChange = (id: string, field: keyof RolePlayCharacter, value: string) => {
    setCharacters(characters.map(char =>
      char.id === id ? { ...char, [field]: value } : char
    ));
  };

  const handleRemoveCharacter = (id: string) => {
    if (characters.length > 2) {
      setCharacters(characters.filter(char => char.id !== id));
      setScript(script.filter(line => line.characterId !== id));
    }
  };

  const handleAddScriptLine = () => {
    setScript([...script, {
      id: crypto.randomUUID(),
      characterId: characters[0].id,
      text: ''
    }]);
  };

  const handleScriptLineChange = (id: string, field: 'characterId' | 'text', value: string) => {
    setScript(script.map(line =>
      line.id === id ? { ...line, [field]: value } : line
    ));
  };

  const handleRemoveScriptLine = (id: string) => {
    if (script.length > 2) {
      setScript(script.filter(line => line.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addScenario({
      title,
      description,
      characters,
      script: script.map(line => ({
        ...line,
        timestamp: 0 // Will be calculated based on position
      })),
      createdBy: user?.id || '',
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Create Role Play Scenario</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
              required
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Characters</label>
              <button
                type="button"
                onClick={handleAddCharacter}
                className="text-blue-500 hover:text-blue-700"
              >
                Add Character
              </button>
            </div>
            {characters.map((character, index) => (
              <div key={character.id} className="mb-4 p-4 border rounded">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">Character {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => handleRemoveCharacter(character.id)}
                    className="text-red-500 hover:text-red-700"
                    disabled={characters.length <= 2}
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      value={character.name}
                      onChange={(e) => handleCharacterChange(character.id, 'name', e.target.value)}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Language</label>
                    <select
                      value={character.language}
                      onChange={(e) => handleCharacterChange(character.id, 'language', e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="it">Italian</option>
                      <option value="ja">Japanese</option>
                      <option value="zh">Chinese</option>
                      <option value="ko">Korean</option>
                    </select>
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={character.description}
                    onChange={(e) => handleCharacterChange(character.id, 'description', e.target.value)}
                    className="w-full p-2 border rounded"
                    rows={2}
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Script</label>
              <button
                type="button"
                onClick={handleAddScriptLine}
                className="text-blue-500 hover:text-blue-700"
              >
                Add Line
              </button>
            </div>
            {script.map((line, index) => (
              <div key={line.id} className="mb-4 p-4 border rounded">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">Line {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => handleRemoveScriptLine(line.id)}
                    className="text-red-500 hover:text-red-700"
                    disabled={script.length <= 2}
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Character</label>
                    <select
                      value={line.characterId}
                      onChange={(e) => handleScriptLineChange(line.id, 'characterId', e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      {characters.map(char => (
                        <option key={char.id} value={char.id}>{char.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Text</label>
                    <input
                      type="text"
                      value={line.text}
                      onChange={(e) => handleScriptLineChange(line.id, 'text', e.target.value)}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 