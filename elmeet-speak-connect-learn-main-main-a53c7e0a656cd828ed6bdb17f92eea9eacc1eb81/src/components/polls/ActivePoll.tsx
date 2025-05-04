import React, { useState, useEffect, useCallback } from 'react';
import { Poll, Quiz } from '../../types/polls';
import { usePolls } from '../../contexts/PollsContext';
import { useAuth } from '../../contexts/AuthContext';

interface ActivePollProps {
  poll: Poll | Quiz;
}

export const ActivePoll: React.FC<ActivePollProps> = ({ poll }) => {
  const { submitResponse, endPoll, getPollResults } = usePolls();
  const { user } = useAuth();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [results, setResults] = useState<{ [optionId: string]: number }>({});
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Set up timer for quizzes with time limits
  useEffect(() => {
    if ('timeLimit' in poll && poll.timeLimit && poll.timeLimit > 0) {
      setTimeLeft(poll.timeLimit);
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === null || prev <= 0) {
            clearInterval(timer);
            setIsTimeUp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [poll]);

  // Auto-submit when time is up
  useEffect(() => {
    if (isTimeUp && !hasSubmitted && selectedOptions.length > 0 && user) {
      handleSubmit();
    }
  }, [isTimeUp, hasSubmitted, selectedOptions, user]);

  // Update results when poll changes or after submission
  const updateResults = useCallback(() => {
    // Check if poll is a Quiz type with showResults property, or default to true for Poll type
    const shouldShowResults = 'showResults' in poll ? poll.showResults !== false : true;
    
    if ((hasSubmitted || user?.id === poll.createdBy) && shouldShowResults) {
      setResults(getPollResults(poll.id));
    }
  }, [hasSubmitted, poll, getPollResults, user]);

  useEffect(() => {
    updateResults();
    
    // Set up interval to refresh results periodically
    const resultsInterval = setInterval(updateResults, 5000);
    return () => clearInterval(resultsInterval);
  }, [updateResults]);

  const handleOptionSelect = (optionId: string) => {
    if (hasSubmitted || isTimeUp) return;

    if (poll.type === 'multiple') {
      setSelectedOptions(prev =>
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleSubmit = () => {
    if (!user || selectedOptions.length === 0) return;

    submitResponse({
      pollId: poll.id,
      userId: user.id,
      selectedOptions
    });

    setHasSubmitted(true);
    updateResults();
  };

  const handleEndPoll = () => {
    if (window.confirm('Are you sure you want to end this poll?')) {
      endPoll(poll.id);
    }
  };

  const totalResponses = Object.values(results).reduce((sum, count) => sum + count, 0);
  
  // Determine if the user selected the correct answer(s) for quizzes
  const getUserScore = () => {
    if (poll.type !== 'quiz' || !hasSubmitted) return null;
    
    // Type assertion to tell TypeScript that poll is a Quiz when type is 'quiz'
    const quizPoll = poll as Quiz;
    const correctAnswers = quizPoll.correctAnswers || [];
    const userCorrect = selectedOptions.filter(id => correctAnswers.includes(id)).length;
    const totalCorrect = correctAnswers.length;
    
    return {
      correct: userCorrect,
      total: totalCorrect,
      percentage: totalCorrect > 0 ? Math.round((userCorrect / totalCorrect) * 100) : 0
    };
  };
  
  const score = getUserScore();

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-blue-50 p-4 border-b border-blue-100 flex justify-between items-center">
        <h3 className="text-xl font-bold text-blue-800">{poll.title}</h3>
        {timeLeft !== null && timeLeft > 0 && (
          <div className={`text-lg font-semibold px-3 py-1 rounded-full ${
            timeLeft < 10 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-blue-100 text-blue-700'
          }`}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        )}
        {timeLeft === 0 && !hasSubmitted && (
          <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
            Time's up!
          </div>
        )}
      </div>

      <div className="p-6">
        {!hasSubmitted ? (
          <>
            <div className="space-y-3 mb-6">
              {poll.options.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  disabled={isTimeUp}
                  className={`w-full p-4 border rounded-lg text-left flex items-center transition-colors ${
                    selectedOptions.includes(option.id)
                      ? 'bg-blue-100 border-blue-500 text-blue-800'
                      : 'hover:bg-gray-50 border-gray-200'
                  } ${isTimeUp ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full mr-3 border text-sm font-medium bg-white">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-grow">{option.text}</span>
                  {selectedOptions.includes(option.id) && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor" data-testid="selected-icon">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {poll.type === 'multiple' ? 'Select all that apply' : 'Select one option'}
              </div>
              <button
                onClick={handleSubmit}
                disabled={selectedOptions.length === 0 || isTimeUp}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Submit
              </button>
            </div>
          </>
        ) : (
          <>
            {poll.type === 'quiz' && score && (
              <div className={`mb-6 p-4 rounded-lg ${
                score.percentage >= 70 ? 'bg-green-100 text-green-800' : 
                score.percentage >= 40 ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                <h4 className="font-semibold text-lg mb-1">Your Score</h4>
                <div className="flex items-center">
                  <div className="text-2xl font-bold mr-2">{score.percentage}%</div>
                  <div>({score.correct} out of {score.total} correct)</div>
                </div>
              </div>
            )}
            
            <div className="space-y-4 mb-6">
              {poll.options.map((option, index) => {
                const count = results[option.id] || 0;
                const percentage = totalResponses > 0
                  ? Math.round((count / totalResponses) * 100)
                  : 0;
                const isSelected = selectedOptions.includes(option.id);
                const isCorrect = poll.type === 'quiz' && option.isCorrect;

                return (
                  <div key={option.id} className="mb-4">
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center">
                        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full mr-2 border text-sm font-medium bg-white">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className={`${isSelected ? 'font-medium' : ''} ${isCorrect ? 'text-green-700' : ''}`}>
                          {option.text}
                        </span>
                        {isSelected && (
                          <span className="ml-2 text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                        {isCorrect && (
                          <span className="ml-2 text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium">{percentage}% ({count})</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          isCorrect ? 'bg-green-500' : 
                          isSelected ? 'bg-blue-500' : 'bg-gray-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-sm text-gray-600 mb-4">
              Total responses: {totalResponses}
            </div>
          </>
        )}
      </div>

      {user?.id === poll.createdBy && (
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <button
            onClick={handleEndPoll}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
            </svg>
            End Poll
          </button>
        </div>
      )}
    </div>
  );
}; 
