import React, { useState, useRef, useEffect } from 'react';
import { useWhiteboard } from '../../contexts/WhiteboardContext';

export const Annotation: React.FC = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [text, setText] = useState('');
  const [isTextMode, setIsTextMode] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { elements, addElement, setTool } = useWhiteboard();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isTextMode) {
      setIsDrawing(true);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      addElement({
        type: 'path',
        data: { points: [{ x, y }] },
        style: {
          color: '#000000',
          size: 2
        },
        userId: 'current-user'
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isTextMode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const currentElement = elements[elements.length - 1];
    if (currentElement && currentElement.type === 'path') {
      addElement({
        ...currentElement,
        data: {
          ...currentElement.data,
          points: [...(currentElement.data.points || []), { x, y }]
        }
      });
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleTextSubmit = () => {
    if (text.trim()) {
      addElement({
        type: 'text',
        data: { text: text },
        style: {
          color: '#000000',
          size: 16
        },
        userId: 'current-user'
      });
      setText('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setIsTextMode(true)}
          className={`px-4 py-2 rounded ${isTextMode ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Text
        </button>
        <button
          onClick={() => setIsTextMode(false)}
          className={`px-4 py-2 rounded ${!isTextMode ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Draw
        </button>
      </div>

      {isTextMode ? (
        <div className="space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your annotation..."
            className="w-full p-2 border rounded min-h-[100px]"
          />
          <button
            onClick={handleTextSubmit}
            disabled={!text.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Add Text
          </button>
        </div>
      ) : (
        <div className="relative border rounded overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-[300px] cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Recent Annotations</h3>
        <div className="space-y-2">
          {elements.map((element, index) => (
            <div key={index} className="p-2 border rounded">
              {element.type === 'text' ? (
                <div>{element.data.text}</div>
              ) : (
                <div className="text-gray-500">Drawing</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 