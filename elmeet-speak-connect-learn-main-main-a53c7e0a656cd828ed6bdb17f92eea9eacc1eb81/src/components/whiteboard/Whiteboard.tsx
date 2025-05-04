import React, { useRef, useEffect, useState } from 'react';
import { useWhiteboard } from '../../contexts/WhiteboardContext';

export const Whiteboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  const { elements, state, addElement, updateElement, setTool, setZoom, setPan } = useWhiteboard();

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

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply zoom and pan
    ctx.save();
    ctx.translate(state.pan.x, state.pan.y);
    ctx.scale(state.zoom, state.zoom);

    // Draw all elements
    elements.forEach(element => {
      ctx.beginPath();
      ctx.strokeStyle = element.style.color;
      ctx.lineWidth = element.style.size;

      switch (element.type) {
        case 'path':
          if (element.data.points && element.data.points.length > 0) {
            ctx.moveTo(element.data.points[0].x, element.data.points[0].y);
            element.data.points.forEach(point => {
              ctx.lineTo(point.x, point.y);
            });
          }
          break;

        case 'text':
          if (element.data.text) {
            ctx.font = `${element.style.size}px Arial`;
            ctx.fillStyle = element.style.color;
            ctx.fillText(element.data.text, element.data.start?.x || 0, element.data.start?.y || 0);
          }
          break;

        case 'shape':
          if (element.data.shape && element.data.start && element.data.end) {
            const { start, end } = element.data;
            switch (element.data.shape) {
              case 'rectangle':
                ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y);
                break;
              case 'circle':
                const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
                ctx.arc(start.x, start.y, radius, 0, Math.PI * 2);
                break;
              case 'line':
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
                break;
              case 'arrow':
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
                // Draw arrow head
                const angle = Math.atan2(end.y - start.y, end.x - start.x);
                ctx.lineTo(
                  end.x - 10 * Math.cos(angle - Math.PI / 6),
                  end.y - 10 * Math.sin(angle - Math.PI / 6)
                );
                ctx.moveTo(end.x, end.y);
                ctx.lineTo(
                  end.x - 10 * Math.cos(angle + Math.PI / 6),
                  end.y - 10 * Math.sin(angle + Math.PI / 6)
                );
                break;
            }
          }
          break;
      }

      ctx.stroke();
      if (element.style.fill) {
        ctx.fillStyle = element.style.fill;
        ctx.fill();
      }
    });

    ctx.restore();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [elements, state.zoom, state.pan]);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - state.pan.x) / state.zoom;
    const y = (e.clientY - rect.top - state.pan.y) / state.zoom;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCanvasCoordinates(e);
    setIsDrawing(true);
    setLastPoint(point);

    if (state.currentTool.type === 'pen') {
      addElement({
        type: 'path',
        data: { points: [point] },
        style: {
          color: state.currentTool.color || '#000000',
          size: state.currentTool.size || 2
        },
        userId: 'current-user' // TODO: Get from auth context
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint) return;

    const point = getCanvasCoordinates(e);

    if (state.currentTool.type === 'pen') {
      const currentElement = elements[elements.length - 1];
      if (currentElement && currentElement.type === 'path') {
        updateElement(currentElement.id, {
          data: {
            ...currentElement.data,
            points: [...(currentElement.data.points || []), point]
          }
        });
      }
    }

    setLastPoint(point);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  return (
    <div className="relative w-full h-full bg-white">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
}; 