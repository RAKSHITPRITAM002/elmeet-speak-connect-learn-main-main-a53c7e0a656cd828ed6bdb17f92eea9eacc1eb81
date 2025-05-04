export interface WhiteboardTool {
  type: 'pen' | 'eraser' | 'text' | 'shape' | 'select';
  color?: string;
  size?: number;
  shape?: 'rectangle' | 'circle' | 'line' | 'arrow';
}

export interface WhiteboardElement {
  id: string;
  type: 'path' | 'text' | 'shape';
  data: {
    points?: { x: number; y: number }[];
    text?: string;
    shape?: 'rectangle' | 'circle' | 'line' | 'arrow';
    start?: { x: number; y: number };
    end?: { x: number; y: number };
  };
  style: {
    color: string;
    size: number;
    fill?: string;
  };
  userId: string;
  timestamp: Date;
}

export interface WhiteboardState {
  elements: WhiteboardElement[];
  selectedElement: string | null;
  currentTool: WhiteboardTool;
  isDrawing: boolean;
  isErasing: boolean;
  isAddingText: boolean;
  isAddingShape: boolean;
  isSelecting: boolean;
  zoom: number;
  pan: { x: number; y: number };
}

export interface WhiteboardContextType {
  elements: WhiteboardElement[];
  state: WhiteboardState;
  addElement: (element: Omit<WhiteboardElement, 'id' | 'timestamp'>) => void;
  updateElement: (id: string, updates: Partial<WhiteboardElement>) => void;
  deleteElement: (id: string) => void;
  clearWhiteboard: () => void;
  setTool: (tool: WhiteboardTool) => void;
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  undo: () => void;
  redo: () => void;
} 