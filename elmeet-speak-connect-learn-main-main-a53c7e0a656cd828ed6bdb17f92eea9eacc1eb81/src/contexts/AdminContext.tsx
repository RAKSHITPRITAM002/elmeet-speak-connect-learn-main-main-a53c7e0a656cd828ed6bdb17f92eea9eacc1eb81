import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UsageStats, MeetingStats, AdminState, AdminContextType } from '../types/admin';

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [usageStats, setUsageStats] = useState<UsageStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalMeetings: 0,
    activeMeetings: 0,
    totalDuration: 0,
    averageDuration: 0,
    peakConcurrentUsers: 0,
    peakConcurrentMeetings: 0,
  });
  const [meetingStats, setMeetingStats] = useState<MeetingStats[]>([]);
  const [state, setState] = useState<AdminState>({
    selectedView: 'dashboard',
    searchQuery: '',
    dateRange: {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      end: new Date(),
    },
    filters: {},
  });

  const addUser = useCallback((user: Omit<User, 'id' | 'joinDate' | 'lastActive'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      joinDate: new Date(),
      lastActive: new Date(),
    };
    setUsers(prev => [...prev, newUser]);
  }, []);

  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...updates } : user
    ));
  }, []);

  const deleteUser = useCallback((id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  }, []);

  const suspendUser = useCallback((id: string) => {
    updateUser(id, { status: 'suspended' });
  }, [updateUser]);

  const activateUser = useCallback((id: string) => {
    updateUser(id, { status: 'active' });
  }, [updateUser]);

  const setView = useCallback((view: AdminState['selectedView']) => {
    setState(prev => ({ ...prev, selectedView: view }));
  }, []);

  const setSelectedUser = useCallback((user?: User) => {
    setState(prev => ({ ...prev, selectedUser: user }));
  }, []);

  const setSelectedMeeting = useCallback((meeting?: MeetingStats) => {
    setState(prev => ({ ...prev, selectedMeeting: meeting }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const setDateRange = useCallback((start: Date, end: Date) => {
    setState(prev => ({ ...prev, dateRange: { start, end } }));
  }, []);

  const setFilters = useCallback((filters: AdminState['filters']) => {
    setState(prev => ({ ...prev, filters }));
  }, []);

  const refreshStats = useCallback(() => {
    // Simulate API call to refresh stats
    setTimeout(() => {
      setUsageStats(prev => ({
        ...prev,
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'active').length,
        totalMeetings: meetingStats.length,
        activeMeetings: meetingStats.filter(m => !m.endTime).length,
      }));
    }, 1000);
  }, [users, meetingStats]);

  return (
    <AdminContext.Provider
      value={{
        users,
        usageStats,
        meetingStats,
        state,
        addUser,
        updateUser,
        deleteUser,
        suspendUser,
        activateUser,
        setView,
        setSelectedUser,
        setSelectedMeeting,
        setSearchQuery,
        setDateRange,
        setFilters,
        refreshStats,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}; 