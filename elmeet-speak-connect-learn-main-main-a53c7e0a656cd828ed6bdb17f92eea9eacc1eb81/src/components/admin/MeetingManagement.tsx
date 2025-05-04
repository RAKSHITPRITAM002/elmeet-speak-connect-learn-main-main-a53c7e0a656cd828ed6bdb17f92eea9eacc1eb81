import React from 'react';
import { useAdmin } from '../../contexts/AdminContext';

export const MeetingManagement: React.FC = () => {
  const {
    meetingStats,
    state,
    setSearchQuery,
    setFilters,
  } = useAdmin();

  const filteredMeetings = meetingStats.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                         meeting.host.toLowerCase().includes(state.searchQuery.toLowerCase());
    const matchesDuration = !state.filters.duration || 
      (state.filters.duration === 'short' && meeting.duration < 30) ||
      (state.filters.duration === 'medium' && meeting.duration >= 30 && meeting.duration < 60) ||
      (state.filters.duration === 'long' && meeting.duration >= 60);
    return matchesSearch && matchesDuration;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Meeting Management</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search meetings..."
            value={state.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded"
          />
          <select
            value={state.filters.duration || ''}
            onChange={(e) => setFilters({ ...state.filters, duration: e.target.value || undefined })}
            className="p-2 border rounded"
          >
            <option value="">All Durations</option>
            <option value="short">Short (< 30 min)</option>
            <option value="medium">Medium (30-60 min)</option>
            <option value="long">Long (> 60 min)</option>
          </select>
        </div>
      </div>

      {/* Meetings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Host</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMeetings.map(meeting => (
              <tr key={meeting.id}>
                <td className="px-6 py-4 whitespace-nowrap">{meeting.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{meeting.host}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(meeting.startTime).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{meeting.duration} min</td>
                <td className="px-6 py-4 whitespace-nowrap">{meeting.participants}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    !meeting.endTime ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {!meeting.endTime ? 'Active' : 'Ended'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {meeting.recordingUrl && (
                    <a
                      href={meeting.recordingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900 mr-2"
                    >
                      View Recording
                    </a>
                  )}
                  <button
                    onClick={() => {/* View details */}}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Meeting Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Meetings</h3>
          <p className="text-2xl font-bold">{meetingStats.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Participants</h3>
          <p className="text-2xl font-bold">
            {meetingStats.reduce((sum, meeting) => sum + meeting.participants, 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Average Duration</h3>
          <p className="text-2xl font-bold">
            {meetingStats.length > 0
              ? Math.round(meetingStats.reduce((sum, meeting) => sum + meeting.duration, 0) / meetingStats.length)
              : 0} min
          </p>
        </div>
      </div>
    </div>
  );
}; 