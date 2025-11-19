export interface Plan {
  id: string;
  name: string;
  monthlyTokenLimit: number;
  maxAgents: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TenantTokenInfo {
  id: string;
  name: string;
  monthlyTokenLimit: number;
  plan: Plan;
}

export interface AgentTokenUsage {
  monthlyLimit: number;
  tokensUsed: number;
  tokensAvailable: number;
  year: number;
  month: number;
}

export interface AgentWithTokenInfo {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  tokenUsage: AgentTokenUsage | null;
}

export interface TenantAgentsResponse {
  tenant: TenantTokenInfo;
  availableTokens: number;
  agents: AgentWithTokenInfo[];
}

export interface TokenAssignmentRequest {
  agentId: string;
  totalTokensAssigned: number;
}

export interface TokenUsageRequest {
  agentId: string;
  tokensUsed: number;
  totalTokensAssigned: number;
}

export interface TokenAssignmentResponse {
  status: boolean;
  message: string;
  data: {
    id: string;
    agentId: string;
    monthlyLimit: number;
    tokensUsed: number;
    year: number;
    month: number;
    createdAt: string;
    updatedAt: string;
  };
}

// Estadísticas para dashboard
export interface TokenStats {
  totalAssigned: number;
  totalUsed: number;
  totalAvailable: number;
  usagePercentage: number;
  agentsCount: number;
  activeAgents: number;
}