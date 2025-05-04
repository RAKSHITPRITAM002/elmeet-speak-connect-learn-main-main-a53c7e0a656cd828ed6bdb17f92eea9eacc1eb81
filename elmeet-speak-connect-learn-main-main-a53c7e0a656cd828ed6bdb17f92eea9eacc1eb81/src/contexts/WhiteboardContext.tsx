import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { WhiteboardElement, WhiteboardState, WhiteboardContextType, WhiteboardTool } from '../types/whiteboard';

const WhiteboardContext = createContext<WhiteboardContextType | undefined>(undefined);

export const WhiteboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [elements, setElements] = useState<WhiteboardElement[]>([]);
  const [state, setState] = useState<WhiteboardState>({
    elements: [],
    selectedElement: null,
    currentTool: { type: 'pen', color: '#000000', size: 2 },
    isDrawing: false,
    isErasing: false,
    isAddingText: false,
    isAddingShape: false,
    isSelecting: false,
    zoom: 1,
    pan: { x: 0, y: 0 }
  });

  const history = useRef<WhiteboardElement[][]>([]);
  const historyIndex = useRef<number>(-1);

  const addElement = useCallback((element: Omit<WhiteboardElement, 'id' | 'timestamp'>) => {
    const newElement: WhiteboardElement = {
      ...element,
      id: crypto.randomUUID(),
      timestamp: new Date()
    };

    setElements(prev => {
      const newElements = [...prev, newElement];
      // Update history
      history.current = history.current.slice(0, historyIndex.current + 1);
      history.current.push(newElements);
      historyIndex.current++;
      return newElements;
    });
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<WhiteboardElement>) => {
    setElements(prev => {
      const newElements = prev.map(element => 
        element.id === id ? { ...element, ...updates } : element
      );
      // Update history
      history.current = history.current.slice(0, historyIndex.current + 1);
      history.current.push(newElements);
      historyIndex.current++;
      return newElements;
    });
  }, []);

  const deleteElement = useCallback((id: string) => {
    setElements(prev => {
      const newElements = prev.filter(element => element.id !== id);
      // Update history
      history.current = history.current.slice(0, historyIndex.current + 1);
      history.current.push(newElements);
      historyIndex.current++;
      return newElements;
    });
  }, []);

  const clearWhiteboard = useCallback(() => {
    setElements([]);
    // Update history
    history.current = history.current.slice(0, historyIndex.current + 1);
    history.current.push([]);
    historyIndex.current++;
  }, []);

  const setTool = useCallback((tool: WhiteboardTool) => {
    setState(prev => ({
      ...prev,
      currentTool: tool,
      isDrawing: tool.type === 'pen',
      isErasing: tool.type === 'eraser',
      isAddingText: tool.type === 'text',
      isAddingShape: tool.type === 'shape',
      isSelecting: tool.type === 'select'
    }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setState(prev => ({ ...prev, zoom }));
  }, []);

  const setPan = useCallback((pan: { x: number; y: number }) => {
    setState(prev => ({ ...prev, pan }));
  }, []);

  const undo = useCallback(() => {
    if (historyIndex.current > 0) {
      historyIndex.current--;
      setElements(history.current[historyIndex.current]);
    }
  }, []);

  const redo = useCallback(() => {
    if (historyIndex.current < history.current.length - 1) {
      historyIndex.current++;
      setElements(history.current[historyIndex.current]);
    }
  }, []);

  return (
    <WhiteboardContext.Provider value={{
      elements,
      state,
      addElement,
      updateElement,
      deleteElement,
      clearWhiteboard,
      setTool,
      setZoom,
      setPan,
      undo,
      redo
    }}>
      {children}
    </WhiteboardContext.Provider>
  );
};

export const useWhiteboard = () => {
  const context = useContext(WhiteboardContext);
  if (!context) {
    throw new Error('useWhiteboard must be used within a WhiteboardProvider');
  }
  return context;
}; 