export interface Message {
  id: number;
  content: string;
  role: "user" | "agent";
  createdAt: string;
}