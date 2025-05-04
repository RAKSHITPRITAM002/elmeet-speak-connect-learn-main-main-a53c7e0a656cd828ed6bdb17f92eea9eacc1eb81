import React from 'react';
import { Whiteboard } from './Whiteboard';
import { WhiteboardToolbar } from './WhiteboardToolbar';

export const WhiteboardPanel: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <WhiteboardToolbar />
      </div>
      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
        <Whiteboard />
      </div>
    </div>
  );
}; 