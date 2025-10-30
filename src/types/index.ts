export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FileItem {
  id: string;
  name: string;
  content: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EditorSettings {
  theme: 'light' | 'dark';
  fontSize: number;
  apiKey: string;
  model: string;
}
