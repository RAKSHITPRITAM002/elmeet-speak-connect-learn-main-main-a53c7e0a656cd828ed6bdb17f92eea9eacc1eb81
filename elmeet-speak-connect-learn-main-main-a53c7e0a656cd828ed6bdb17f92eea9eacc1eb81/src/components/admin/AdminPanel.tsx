import React from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { AdminDashboard } from './AdminDashboard';
import { UserManagement } from './UserManagement';
import { MeetingManagement } from './MeetingManagement';
import { SystemSettings } from './SystemSettings';

export const AdminPanel: React.FC = () => {
  const { state, setView } = useAdmin();

  const renderContent = () => {
    switch (state.selectedView) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <UserManagement />;
      case 'meetings':
        return <MeetingManagement />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => setView('dashboard')}
              className={`w-full text-left px-4 py-2 rounded ${
                state.selectedView === 'dashboard'
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              Dashboard
            </button>
            
            <button
              onClick={() => setView('users')}
              className={`w-full text-left px-4 py-2 rounded ${
                state.selectedView === 'users'
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              User Management
            </button>
            
            <button
              onClick={() => setView('meetings')}
              className={`w-full text-left px-4 py-2 rounded ${
                state.selectedView === 'meetings'
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              Meeting Management
            </button>
            
            <button
              onClick={() => setView('settings')}
              className={`w-full text-left px-4 py-2 rounded ${
                state.selectedView === 'settings'
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              System Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {renderContent()}
      </div>
    </div>
  );
}; 