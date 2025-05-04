import React, { useState, useEffect } from 'react';
import { PollType, PollOption } from '../../types/polls';
import { usePolls } from '../../contexts/PollsContext';
import { useAuth } from '../../contexts/AuthContext';

interface CreatePollModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePollModal: React.FC<CreatePollModalProps> = ({ isOpen, onClose }) => {
  const { addPoll, addQuiz } = usePolls();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<PollType>('single');
  const [options, setOptions] = useState<PollOption[]>([
    { id: crypto.randomUUID(), text: '' },
    { id: crypto.randomUUID(), text: '' }
  ]);
  const [timeLimit, setTimeLimit] = useState<number>(60);
  const [showResults, setShowResults] = useState(true);
  const [formErrors, setFormErrors] = useState<{
    title?: string;
    options?: string;
    correctAnswers?: string;
  }>({});

  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setType('single');
      setOptions([
        { id: crypto.randomUUID(), text: '' },
        { id: crypto.randomUUID(), text: '' }
      ]);
      setTimeLimit(60);
      setShowResults(true);
      setFormErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const errors: {
      title?: string;
      options?: string;
      correctAnswers?: string;
    } = {};
    
    if (!title.trim()) {
      errors.title = 'Title is required';
    }
    
    const emptyOptions = options.some(opt => !opt.text.trim());
    if (emptyOptions) {
      errors.options = 'All options must have text';
    }
    
    if (type === 'quiz') {
      const hasCorrectAnswer = options.some(opt => opt.isCorrect);
      if (!hasCorrectAnswer) {
        errors.correctAnswers = 'At least one correct answer must be selected';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddOption = () => {
    setOptions([...options, { id: crypto.randomUUID(), text: '' }]);
  };

  const handleOptionChange = (id: string, text: string) => {
    setOptions(options.map(opt => opt.id === id ? { ...opt, text } : opt));
    
    // Clear option error if all options now have text
    if (formErrors.options && options.every(opt => opt.id === id ? text.trim() : opt.text.trim())) {
      setFormErrors(prev => ({ ...prev, options: undefined }));
    }
  };

  const handleOptionRemove = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter(opt => opt.id !== id));
    }
  };

  const handleCorrectAnswerChange = (id: string, isCorrect: boolean) => {
    const newOptions = options.map(opt =>
      opt.id === id ? { ...opt, isCorrect } : opt
    );
    setOptions(newOptions);
    
    // Clear correct answer error if at least one option is now marked as correct
    if (formErrors.correctAnswers && isCorrect) {
      setFormErrors(prev => ({ ...prev, correctAnswers: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (type === 'quiz') {
      addQuiz({
        title,
        type: 'quiz',
        options,
        isActive: false,
        createdBy: user?.id || '',
        timeLimit,
        showResults,
        correctAnswers: options
          .filter(opt => opt.isCorrect)
          .map(opt => opt.id)
      });
    } else {
      addPoll({
        title,
        type,
        options,
        isActive: false,
        createdBy: user?.id || ''
      });
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-800">
            Create {type === 'quiz' ? 'Quiz' : 'Poll'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) {
                  setFormErrors(prev => ({ ...prev, title: undefined }));
                }
              }}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter poll title"
            />
            {formErrors.title && (
              <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Type</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setType('single')}
                className={`p-3 rounded-lg border ${
                  type === 'single' 
                    ? 'bg-blue-100 border-blue-500 text-blue-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                Single Choice
              </button>
              <button
                type="button"
                onClick={() => setType('multiple')}
                className={`p-3 rounded-lg border ${
                  type === 'multiple' 
                    ? 'bg-blue-100 border-blue-500 text-blue-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                Multiple Choice
              </button>
              <button
                type="button"
                onClick={() => setType('quiz')}
                className={`p-3 rounded-lg border ${
                  type === 'quiz' 
                    ? 'bg-purple-100 border-purple-500 text-purple-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                Quiz
              </button>
            </div>
          </div>

          {type === 'quiz' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Time Limit (seconds)</label>
                <input
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
                <p className="mt-1 text-xs text-gray-500">Set to 0 for no time limit</p>
              </div>
              <div className="flex items-center h-full pt-8">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={showResults}
                      onChange={(e) => setShowResults(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`block w-14 h-8 rounded-full ${showResults ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${showResults ? 'transform translate-x-6' : ''}`}></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700">Show Results After Submission</span>
                </label>
              </div>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Options</label>
              <button
                type="button"
                onClick={handleAddOption}
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Option
              </button>
            </div>
            
            {formErrors.options && (
              <p className="mb-2 text-sm text-red-600">{formErrors.options}</p>
            )}
            
            {type === 'quiz' && formErrors.correctAnswers && (
              <p className="mb-2 text-sm text-red-600">{formErrors.correctAnswers}</p>
            )}
            
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={option.id} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <span className="text-sm font-medium text-gray-500 w-6">{index + 1}.</span>
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(option.id, e.target.value)}
                    className={`flex-1 p-2 border rounded-md ${
                      formErrors.options && !option.text.trim() ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter option text"
                  />
                  
                  {type === 'quiz' && (
                    <div className="flex items-center">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!option.isCorrect}
                          onChange={(e) => handleCorrectAnswerChange(option.id, e.target.checked)}
                          className="form-checkbox h-5 w-5 text-green-600 rounded focus:ring-green-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Correct</span>
                      </label>
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => handleOptionRemove(option.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    disabled={options.length <= 2}
                    title={options.length <= 2 ? "At least 2 options required" : "Remove option"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create {type === 'quiz' ? 'Quiz' : 'Poll'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 