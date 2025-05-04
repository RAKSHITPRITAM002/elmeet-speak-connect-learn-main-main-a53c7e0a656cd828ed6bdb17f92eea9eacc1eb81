import React, { useState } from 'react';

interface SystemSettings {
  maxParticipants: number;
  maxDuration: number;
  recordingEnabled: boolean;
  chatEnabled: boolean;
  whiteboardEnabled: boolean;
  breakoutRoomsEnabled: boolean;
  languageToolsEnabled: boolean;
  defaultLanguage: string;
  timezone: string;
}

export const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    maxParticipants: 100,
    maxDuration: 120,
    recordingEnabled: true,
    chatEnabled: true,
    whiteboardEnabled: true,
    breakoutRoomsEnabled: true,
    languageToolsEnabled: true,
    defaultLanguage: 'en',
    timezone: 'UTC',
  });

  const handleChange = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // TODO: Save settings to backend
    console.log('Saving settings:', settings);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Meeting Settings */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Meeting Settings</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Maximum Participants
              </label>
              <input
                type="number"
                value={settings.maxParticipants}
                onChange={(e) => handleChange('maxParticipants', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="1"
                max="1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Maximum Duration (minutes)
              </label>
              <input
                type="number"
                value={settings.maxDuration}
                onChange={(e) => handleChange('maxDuration', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="15"
                max="1440"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.recordingEnabled}
                  onChange={(e) => handleChange('recordingEnabled', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span className="ml-2">Enable Recording</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.chatEnabled}
                  onChange={(e) => handleChange('chatEnabled', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span className="ml-2">Enable Chat</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.whiteboardEnabled}
                  onChange={(e) => handleChange('whiteboardEnabled', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span className="ml-2">Enable Whiteboard</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.breakoutRoomsEnabled}
                  onChange={(e) => handleChange('breakoutRoomsEnabled', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span className="ml-2">Enable Breakout Rooms</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.languageToolsEnabled}
                  onChange={(e) => handleChange('languageToolsEnabled', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span className="ml-2">Enable Language Tools</span>
              </label>
            </div>
          </div>

          {/* System Settings */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">System Settings</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Default Language
              </label>
              <select
                value={settings.defaultLanguage}
                onChange={(e) => handleChange('defaultLanguage', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
                <option value="zh">Chinese</option>
                <option value="ko">Korean</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time</option>
                <option value="CST">Central Time</option>
                <option value="MST">Mountain Time</option>
                <option value="PST">Pacific Time</option>
                <option value="GMT">Greenwich Mean Time</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}; 