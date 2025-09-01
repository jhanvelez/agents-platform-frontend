export interface Plan {
  id: string;
  name: string;
  maxAgents: number;
  maxConsultsPerMonth: number;
  monthlyTokenLimit: number;
  isActive: boolean;
}