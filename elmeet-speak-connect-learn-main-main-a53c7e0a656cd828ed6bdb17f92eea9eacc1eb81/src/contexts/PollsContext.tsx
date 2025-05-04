import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Poll, Quiz, PollResponse } from '../types/polls';

interface PollsContextType {
  polls: (Poll | Quiz)[];
  activePoll: Poll | Quiz | null;
  addPoll: (poll: Omit<Poll, 'id' | 'createdAt' | 'responses'>) => void;
  addQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt' | 'responses'>) => void;
  startPoll: (pollId: string) => void;
  endPoll: (pollId: string) => void;
  submitResponse: (response: Omit<PollResponse, 'timestamp'>) => void;
  getPollResults: (pollId: string) => { [optionId: string]: number };
  deletePoll: (pollId: string) => void;
}

const PollsContext = createContext<PollsContextType | undefined>(undefined);

// Local storage key for polls
const POLLS_STORAGE_KEY = 'elmeet_polls';
const ACTIVE_POLL_KEY = 'elmeet_active_poll';

export const PollsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [polls, setPolls] = useState<(Poll | Quiz)[]>(() => {
    // Load polls from localStorage on initial render
    const savedPolls = localStorage.getItem(POLLS_STORAGE_KEY);
    return savedPolls ? JSON.parse(savedPolls) : [];
  });
  
  const [activePoll, setActivePoll] = useState<Poll | Quiz | null>(() => {
    // Load active poll from localStorage
    const savedActivePoll = localStorage.getItem(ACTIVE_POLL_KEY);
    return savedActivePoll ? JSON.parse(savedActivePoll) : null;
  });

  // Save polls to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(POLLS_STORAGE_KEY, JSON.stringify(polls));
  }, [polls]);

  // Save active poll to localStorage whenever it changes
  useEffect(() => {
    if (activePoll) {
      localStorage.setItem(ACTIVE_POLL_KEY, JSON.stringify(activePoll));
    } else {
      localStorage.removeItem(ACTIVE_POLL_KEY);
    }
  }, [activePoll]);

  const addPoll = useCallback((poll: Omit<Poll, 'id' | 'createdAt' | 'responses'>) => {
    const newPoll: Poll = {
      ...poll,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      responses: {},
    };
    setPolls(prev => [...prev, newPoll]);
    console.log('Poll added:', newPoll);
  }, []);

  const addQuiz = useCallback((quiz: Omit<Quiz, 'id' | 'createdAt' | 'responses'>) => {
    const newQuiz: Quiz = {
      ...quiz,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      responses: {},
    };
    setPolls(prev => [...prev, newQuiz]);
    console.log('Quiz added:', newQuiz);
  }, []);

  const startPoll = useCallback((pollId: string) => {
    setPolls(prev => prev.map(poll => 
      poll.id === pollId ? { ...poll, isActive: true } : { ...poll, isActive: false }
    ));
    
    const poll = polls.find(p => p.id === pollId);
    if (poll) {
      const updatedPoll = { ...poll, isActive: true };
      setActivePoll(updatedPoll);
      console.log('Poll started:', updatedPoll);
    }
  }, [polls]);

  const endPoll = useCallback((pollId: string) => {
    setPolls(prev => prev.map(poll => 
      poll.id === pollId ? { ...poll, isActive: false } : poll
    ));
    
    if (activePoll?.id === pollId) {
      setActivePoll(null);
      console.log('Poll ended:', pollId);
    }
  }, [activePoll]);

  const deletePoll = useCallback((pollId: string) => {
    setPolls(prev => prev.filter(poll => poll.id !== pollId));
    
    if (activePoll?.id === pollId) {
      setActivePoll(null);
    }
    console.log('Poll deleted:', pollId);
  }, [activePoll]);

  const submitResponse = useCallback((response: Omit<PollResponse, 'timestamp'>) => {
    setPolls(prev => prev.map(poll => {
      if (poll.id === response.pollId) {
        const newResponses = { ...poll.responses };
        response.selectedOptions.forEach(optionId => {
          if (!newResponses[optionId]) newResponses[optionId] = [];
          if (!newResponses[optionId].includes(response.userId)) {
            newResponses[optionId].push(response.userId);
          }
        });
        
        const updatedPoll = { ...poll, responses: newResponses };
        
        // If this is the active poll, update it as well
        if (activePoll?.id === poll.id) {
          setActivePoll(updatedPoll);
        }
        
        return updatedPoll;
      }
      return poll;
    }));
    console.log('Response submitted:', response);
  }, [activePoll]);

  const getPollResults = useCallback((pollId: string) => {
    const poll = polls.find(p => p.id === pollId);
    if (!poll) return {};
    
    return Object.entries(poll.responses).reduce((acc, [optionId, userIds]) => {
      acc[optionId] = userIds.length;
      return acc;
    }, {} as { [optionId: string]: number });
  }, [polls]);

  return (
    <PollsContext.Provider value={{
      polls,
      activePoll,
      addPoll,
      addQuiz,
      startPoll,
      endPoll,
      submitResponse,
      getPollResults,
      deletePoll,
    }}>
      {children}
    </PollsContext.Provider>
  );
};

export const usePolls = () => {
  const context = useContext(PollsContext);
  if (!context) {
    throw new Error('usePolls must be used within a PollsProvider');
  }
  return context;
}; 