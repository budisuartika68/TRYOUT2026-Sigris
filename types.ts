
export enum AppStatus {
  LOGIN = 'LOGIN',
  EXAM = 'EXAM',
  LOCKED = 'LOCKED',
  FINISHED = 'FINISHED'
}

export interface Student {
  id: string;
  loginTime: string;
  coords?: {
    latitude: number;
    longitude: number;
  };
}

export interface ExamStats {
  tabSwitches: number;
  resizes: number;
  cameraActive: boolean;
  gpsActive: boolean;
}

export interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

export interface LoggerPayload {
  user?: string;
  event: string;
  violationCount?: number;
  penalty?: number;
  location?: Student['coords'] | null;
  image?: string | null;
  timestamp?: string;
  cameraActive?: boolean;
}
