export type Screen = 'dashboard' | 'lab' | 'learn' | 'quiz' | 'simulator' | 'askai';

export type LabPhase = 'idle' | 'scanning' | 'sending' | 'captured' | 'done';

export interface TerminalLine {
  id: number;
  text: string;
  type: 'command' | 'output' | 'success' | 'error' | 'info' | 'capture';
  delay: number;
}

export interface EmailMessage {
  id: number;
  from: string;
  subject: string;
  preview: string;
  body: string;
  isPhish: boolean;
  time: string;
  redFlags?: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LearnModule {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  description: string;
  topics: string[];
  icon: string;
}
