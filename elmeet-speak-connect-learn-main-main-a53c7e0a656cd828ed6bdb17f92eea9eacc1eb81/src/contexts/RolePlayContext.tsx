import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { RolePlayScenario, RolePlayResponse, RolePlayState } from '../types/roleplay';

interface RolePlayContextType {
  scenarios: RolePlayScenario[];
  activeScenario: RolePlayScenario | null;
  responses: RolePlayResponse[];
  state: RolePlayState;
  addScenario: (scenario: Omit<RolePlayScenario, 'id' | 'createdAt' | 'isActive' | 'currentLineIndex'>) => void;
  startScenario: (scenarioId: string) => void;
  endScenario: (scenarioId: string) => void;
  playScenario: () => void;
  pauseScenario: () => void;
  recordResponse: (response: Omit<RolePlayResponse, 'id' | 'timestamp'>) => void;
  updateFeedback: (responseId: string, feedback: RolePlayResponse['feedback']) => void;
  selectCharacter: (characterId: string | null) => void;
  deleteScenario: (scenarioId: string) => void;
  updateCurrentLineIndex: (index: number) => void;
}

const RolePlayContext = createContext<RolePlayContextType | undefined>(undefined);

// Local storage keys
const SCENARIOS_STORAGE_KEY = 'elmeet_roleplay_scenarios';
const ACTIVE_SCENARIO_KEY = 'elmeet_active_scenario';
const RESPONSES_STORAGE_KEY = 'elmeet_roleplay_responses';
const STATE_STORAGE_KEY = 'elmeet_roleplay_state';

export const RolePlayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scenarios, setScenarios] = useState<RolePlayScenario[]>(() => {
    // Load scenarios from localStorage on initial render
    const savedScenarios = localStorage.getItem(SCENARIOS_STORAGE_KEY);
    return savedScenarios ? JSON.parse(savedScenarios) : [];
  });
  
  const [activeScenario, setActiveScenario] = useState<RolePlayScenario | null>(() => {
    // Load active scenario from localStorage
    const savedActiveScenario = localStorage.getItem(ACTIVE_SCENARIO_KEY);
    return savedActiveScenario ? JSON.parse(savedActiveScenario) : null;
  });
  
  const [responses, setResponses] = useState<RolePlayResponse[]>(() => {
    // Load responses from localStorage
    const savedResponses = localStorage.getItem(RESPONSES_STORAGE_KEY);
    return savedResponses ? JSON.parse(savedResponses) : [];
  });
  
  const [state, setState] = useState<RolePlayState>(() => {
    // Load state from localStorage
    const savedState = localStorage.getItem(STATE_STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : {
      isPlaying: false,
      currentTime: 0,
      isRecording: false,
      selectedCharacter: null,
    };
  });

  // Save scenarios to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(SCENARIOS_STORAGE_KEY, JSON.stringify(scenarios));
  }, [scenarios]);

  // Save active scenario to localStorage whenever it changes
  useEffect(() => {
    if (activeScenario) {
      localStorage.setItem(ACTIVE_SCENARIO_KEY, JSON.stringify(activeScenario));
    } else {
      localStorage.removeItem(ACTIVE_SCENARIO_KEY);
    }
  }, [activeScenario]);

  // Save responses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(RESPONSES_STORAGE_KEY, JSON.stringify(responses));
  }, [responses]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addScenario = useCallback((scenario: Omit<RolePlayScenario, 'id' | 'createdAt' | 'isActive' | 'currentLineIndex'>) => {
    const newScenario: RolePlayScenario = {
      ...scenario,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      isActive: false,
      currentLineIndex: 0,
    };
    setScenarios(prev => [...prev, newScenario]);
    console.log('Scenario added:', newScenario);
  }, []);

  const deleteScenario = useCallback((scenarioId: string) => {
    setScenarios(prev => prev.filter(scenario => scenario.id !== scenarioId));
    
    if (activeScenario?.id === scenarioId) {
      setActiveScenario(null);
      setState(prev => ({ ...prev, isPlaying: false, currentTime: 0, selectedCharacter: null }));
    }
    console.log('Scenario deleted:', scenarioId);
  }, [activeScenario]);

  const startScenario = useCallback((scenarioId: string) => {
    // Update all scenarios, marking the selected one as active
    const updatedScenarios = scenarios.map(scenario => 
      scenario.id === scenarioId ? { ...scenario, isActive: true } : { ...scenario, isActive: false }
    );
    setScenarios(updatedScenarios);
    
    // Find the scenario that was just activated
    const scenario = updatedScenarios.find(s => s.id === scenarioId);
    if (scenario) {
      // Set it as the active scenario
      setActiveScenario({ ...scenario, currentLineIndex: 0 });
      // Reset state
      setState(prev => ({ 
        ...prev, 
        isPlaying: false, 
        currentTime: 0,
        selectedCharacter: null 
      }));
      console.log('Scenario started:', scenario);
    }
  }, [scenarios]);

  const endScenario = useCallback((scenarioId: string) => {
    setScenarios(prev => prev.map(scenario => 
      scenario.id === scenarioId ? { ...scenario, isActive: false } : scenario
    ));
    
    if (activeScenario?.id === scenarioId) {
      setActiveScenario(null);
      setState(prev => ({ ...prev, isPlaying: false, currentTime: 0, selectedCharacter: null }));
      console.log('Scenario ended:', scenarioId);
    }
  }, [activeScenario]);

  const playScenario = useCallback(() => {
    if (!activeScenario) return;
    setState(prev => ({ ...prev, isPlaying: true }));
    console.log('Scenario playback started');
  }, [activeScenario]);

  const pauseScenario = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }));
    console.log('Scenario playback paused');
  }, []);

  const updateCurrentLineIndex = useCallback((index: number) => {
    if (!activeScenario) return;
    
    const updatedScenario = { ...activeScenario, currentLineIndex: index };
    setActiveScenario(updatedScenario);
    console.log('Current line index updated:', index);
  }, [activeScenario]);

  const recordResponse = useCallback((response: Omit<RolePlayResponse, 'id' | 'timestamp'>) => {
    const newResponse: RolePlayResponse = {
      ...response,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    setResponses(prev => [...prev, newResponse]);
    console.log('Response recorded:', newResponse);
  }, []);

  const updateFeedback = useCallback((responseId: string, feedback: RolePlayResponse['feedback']) => {
    setResponses(prev => prev.map(response => 
      response.id === responseId ? { ...response, feedback } : response
    ));
    console.log('Feedback updated for response:', responseId);
  }, []);

  const selectCharacter = useCallback((characterId: string | null) => {
    setState(prev => ({ ...prev, selectedCharacter: characterId }));
    console.log('Character selected:', characterId);
  }, []);

  return (
    <RolePlayContext.Provider value={{
      scenarios,
      activeScenario,
      responses,
      state,
      addScenario,
      startScenario,
      endScenario,
      playScenario,
      pauseScenario,
      recordResponse,
      updateFeedback,
      selectCharacter,
      deleteScenario,
      updateCurrentLineIndex,
    }}>
      {children}
    </RolePlayContext.Provider>
  );
};

export const useRolePlay = () => {
  const context = useContext(RolePlayContext);
  if (!context) {
    throw new Error('useRolePlay must be used within a RolePlayProvider');
  }
  return context;
}; 