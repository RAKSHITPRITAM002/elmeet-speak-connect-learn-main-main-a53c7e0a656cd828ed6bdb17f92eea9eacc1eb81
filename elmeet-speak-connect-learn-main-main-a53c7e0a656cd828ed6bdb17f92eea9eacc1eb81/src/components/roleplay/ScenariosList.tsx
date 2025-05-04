import React, { useState } from 'react';
import { RolePlayScenario } from '../../types/roleplay';
import { useRolePlay } from '../../contexts/RolePlayContext';
import { CreateScenarioModal } from './CreateScenarioModal';
import { ActiveScenario } from './ActiveScenario';

export const ScenariosList: React.FC = () => {
  const { scenarios, activeScenario, startScenario } = useRolePlay();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleStartScenario = (scenarioId: string) => {
    startScenario(scenarioId);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Role Play Scenarios</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New
        </button>
      </div>

      {activeScenario && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Active Scenario</h3>
          <ActiveScenario scenario={activeScenario} />
        </div>
      )}

      <div className="grid gap-4">
        {scenarios.map(scenario => (
          <div
            key={scenario.id}
            className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{scenario.title}</h3>
                <p className="text-sm text-gray-500">{scenario.description}</p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(scenario.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  Characters: {scenario.characters.length}
                </p>
                <p className="text-sm text-gray-500">
                  Script Lines: {scenario.script.length}
                </p>
              </div>
              {!scenario.isActive && (
                <button
                  onClick={() => handleStartScenario(scenario.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                  Start
                </button>
              )}
            </div>
            {scenario.isActive && (
              <div className="mt-2 text-sm text-green-600">
                Active
              </div>
            )}
          </div>
        ))}
      </div>

      <CreateScenarioModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}; 