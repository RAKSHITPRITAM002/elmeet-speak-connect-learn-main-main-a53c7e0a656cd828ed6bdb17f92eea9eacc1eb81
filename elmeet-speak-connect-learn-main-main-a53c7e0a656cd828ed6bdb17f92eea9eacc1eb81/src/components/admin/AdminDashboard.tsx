import React, { useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';

export const AdminDashboard: React.FC = () => {
  const { usageStats, state, refreshStats } = useAdmin();

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Users</h3>
          <p className="text-2xl font-bold">{usageStats.totalUsers}</p>
          <p className="text-sm text-green-500">
            {usageStats.activeUsers} active
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Meetings</h3>
          <p className="text-2xl font-bold">{usageStats.totalMeetings}</p>
          <p className="text-sm text-blue-500">
            {usageStats.activeMeetings} active
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Duration</h3>
          <p className="text-2xl font-bold">{usageStats.totalDuration} min</p>
          <p className="text-sm text-gray-500">
            Avg: {usageStats.averageDuration} min
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Peak Usage</h3>
          <p className="text-2xl font-bold">{usageStats.peakConcurrentUsers}</p>
          <p className="text-sm text-gray-500">
            {usageStats.peakConcurrentMeetings} meetings
          </p>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Date Range</h2>
        <div className="flex gap-4">
          <input
            type="date"
            value={state.dateRange.start.toISOString().split('T')[0]}
            onChange={(e) => {
              const start = new Date(e.target.value);
              start.setHours(0, 0, 0, 0);
              // setDateRange(start, state.dateRange.end);
            }}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={state.dateRange.end.toISOString().split('T')[0]}
            onChange={(e) => {
              const end = new Date(e.target.value);
              end.setHours(23, 59, 59, 999);
              // setDateRange(state.dateRange.start, end);
            }}
            className="p-2 border rounded"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => {/* setView('users') */}}
            className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Manage Users
          </button>
          <button
            onClick={() => {/* setView('meetings') */}}
            className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            View Meetings
          </button>
          <button
            onClick={() => {/* setView('settings') */}}
            className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            System Settings
          </button>
          <button
            onClick={refreshStats}
            className="p-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Refresh Stats
          </button>
        </div>
      </div>
    </div>
  );
}; 