import React from 'react';
import { useWhiteboard } from '../../contexts/WhiteboardContext';

const COLORS = [
  '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
  '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff'
];

const SIZES = [1, 2, 4, 8, 16];

export const WhiteboardToolbar: React.FC = () => {
  const { state, setTool, clearWhiteboard, undo, redo, setZoom } = useWhiteboard();

  const handleToolChange = (type: string) => {
    setTool({
      type,
      color: state.currentTool.color,
      size: state.currentTool.size
    });
  };

  const handleColorChange = (color: string) => {
    setTool({
      ...state.currentTool,
      color
    });
  };

  const handleSizeChange = (size: number) => {
    setTool({
      ...state.currentTool,
      size
    });
  };

  const handleZoomChange = (delta: number) => {
    setZoom(Math.max(0.1, Math.min(5, state.zoom + delta)));
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow">
      <div className="flex flex-wrap gap-4">
        {/* Tools */}
        <div className="flex gap-2">
          <button
            onClick={() => handleToolChange('pen')}
            className={`p-2 rounded ${state.currentTool.type === 'pen' ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            ✏️
          </button>
          <button
            onClick={() => handleToolChange('eraser')}
            className={`p-2 rounded ${state.currentTool.type === 'eraser' ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            🧹
          </button>
          <button
            onClick={() => handleToolChange('text')}
            className={`p-2 rounded ${state.currentTool.type === 'text' ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            T
          </button>
          <button
            onClick={() => handleToolChange('shape')}
            className={`p-2 rounded ${state.currentTool.type === 'shape' ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            ⬡
          </button>
          <button
            onClick={() => handleToolChange('select')}
            className={`p-2 rounded ${state.currentTool.type === 'select' ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            ✥
          </button>
        </div>

        {/* Colors */}
        <div className="flex gap-2">
          {COLORS.map(color => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              className={`w-6 h-6 rounded-full border ${state.currentTool.color === color ? 'ring-2 ring-blue-500' : ''}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        {/* Sizes */}
        <div className="flex gap-2">
          {SIZES.map(size => (
            <button
              key={size}
              onClick={() => handleSizeChange(size)}
              className={`p-2 rounded ${state.currentTool.size === size ? 'bg-blue-500 text-white' : 'bg-white'}`}
            >
              {size}px
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={undo}
            className="p-2 rounded bg-white hover:bg-gray-200"
          >
            ↩️
          </button>
          <button
            onClick={redo}
            className="p-2 rounded bg-white hover:bg-gray-200"
          >
            ↪️
          </button>
          <button
            onClick={clearWhiteboard}
            className="p-2 rounded bg-white hover:bg-gray-200"
          >
            🗑️
          </button>
        </div>

        {/* Zoom */}
        <div className="flex gap-2">
          <button
            onClick={() => handleZoomChange(-0.1)}
            className="p-2 rounded bg-white hover:bg-gray-200"
          >
            ➖
          </button>
          <span className="p-2">
            {Math.round(state.zoom * 100)}%
          </span>
          <button
            onClick={() => handleZoomChange(0.1)}
            className="p-2 rounded bg-white hover:bg-gray-200"
          >
            ➕
          </button>
        </div>
      </div>
    </div>
  );
}; 