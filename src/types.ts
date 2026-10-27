export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  stats?: {
    latencyMs?: number;
    model?: string;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface ServerInfo {
  serverName: string;
  version: string;
  creator: string;
  status: 'ONLINE' | 'CONNECTING' | 'OFFLINE';
  online?: boolean;
  networkStatus?: string;
  uptimeSeconds: number;
  totalRequests?: number;
  activeUsersOnline?: number;
  memoryMb?: number;
  model: string;
  features: string[];
  hasApiKey: boolean;
}
