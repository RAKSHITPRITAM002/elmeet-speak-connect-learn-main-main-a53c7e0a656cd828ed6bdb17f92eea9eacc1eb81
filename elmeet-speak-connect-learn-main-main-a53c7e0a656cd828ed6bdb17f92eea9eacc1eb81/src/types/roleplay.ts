export interface RolePlayCharacter {
  id: string;
  name: string;
  description: string;
  language: string;
  avatar?: string;
  voice?: string; // For text-to-speech
}

export interface RolePlayScenario {
  id: string;
  title: string;
  description: string;
  characters: RolePlayCharacter[];
  script: {
    id: string;
    characterId: string;
    text: string;
    audioUrl?: string;
    timestamp: number;
  }[];
  backgroundImage?: string;
  createdBy: string;
  createdAt: Date;
  isActive: boolean;
  currentLineIndex: number;
}

export interface RolePlayResponse {
  id: string;
  scenarioId: string;
  userId: string;
  characterId: string;
  text: string;
  audioUrl?: string;
  timestamp: Date;
  feedback?: {
    pronunciation: number;
    fluency: number;
    accuracy: number;
    comments: string;
  };
}

export interface RolePlayState {
  isPlaying: boolean;
  currentTime: number;
  isRecording: boolean;
  selectedCharacter: string | null;
} 