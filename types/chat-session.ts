import { Agent } from "./agent"

export interface ChatSession {
  id: string;
  name: string;
  agent: Agent;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}