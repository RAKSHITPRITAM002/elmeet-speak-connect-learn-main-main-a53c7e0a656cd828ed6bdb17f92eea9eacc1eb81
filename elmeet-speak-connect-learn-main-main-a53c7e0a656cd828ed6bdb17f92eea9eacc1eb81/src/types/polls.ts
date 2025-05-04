export type PollType = 'single' | 'multiple' | 'quiz';

export interface PollOption {
  id: string;
  text: string;
  isCorrect?: boolean; // For quizzes
}

export interface Poll {
  id: string;
  title: string;
  type: PollType;
  options: PollOption[];
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  responses: {
    [optionId: string]: string[]; // userIds who selected this option
  };
}

export interface Quiz extends Poll {
  type: 'quiz';
  timeLimit?: number; // in seconds
  showResults: boolean;
  correctAnswers: string[]; // optionIds that are correct
}

export interface PollResponse {
  pollId: string;
  userId: string;
  selectedOptions: string[]; // optionIds
  timestamp: Date;
} 