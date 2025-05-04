import React, { useState, useEffect } from 'react';
import { Poll, Quiz } from '../../types/polls';
import { usePolls } from '../../contexts/PollsContext';
import { CreatePollModal } from './CreatePollModal';
import { ActivePoll } from './ActivePoll';

export const PollsList: React.FC = () => {
  const { polls, activePoll, startPoll, deletePoll } = usePolls();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPolls, setFilteredPolls] = useState<(Poll | Quiz)[]>(polls);

  // Filter polls when search term or polls change
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPolls(polls);
    } else {
      const filtered = polls.filter(poll => 
        poll.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPolls(filtered);
    }
  }, [searchTerm, polls]);

  const handleStartPoll = (pollId: string) => {
    startPoll(pollId);
  };

  const handleDeletePoll = (pollId: string) => {
    if (window.confirm('Are you sure you want to delete this poll?')) {
      deletePoll(pollId);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-800">Polls & Quizzes</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Poll/Quiz
        </button>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search polls and quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {activePoll && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-green-700">Active Poll</h3>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Live
            </span>
          </div>
          <ActivePoll poll={activePoll} />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPolls.length > 0 ? (
          filteredPolls.map(poll => (
            <div
              key={poll.id}
              className={`bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow border-l-4 ${
                poll.type === 'quiz' ? 'border-purple-500' : 'border-blue-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{poll.title}</h3>
                  <div className="flex items-center mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      poll.type === 'quiz' ? 'bg-purple-100 text-purple-800' : 
                      poll.type === 'multiple' ? 'bg-blue-100 text-blue-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {poll.type === 'quiz' ? 'Quiz' : poll.type === 'multiple' ? 'Multiple Choice' : 'Single Choice'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Created: {new Date(poll.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Options: {poll.options.length}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between">
                {!poll.isActive ? (
                  <button
                    onClick={() => handleStartPoll(poll.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Start
                  </button>
                ) : (
                  <span className="text-sm text-green-600 font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Active
                  </span>
                )}
                
                <button
                  onClick={() => handleDeletePoll(poll.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  title="Delete Poll"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            {searchTerm ? 
              `No polls or quizzes found matching "${searchTerm}"` : 
              "No polls or quizzes created yet. Click 'Add Poll/Quiz' to create one."}
          </div>
        )}
      </div>

      <CreatePollModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}; 