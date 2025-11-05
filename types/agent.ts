
import { Tenant } from './tenant'
import { ModelIA } from './models-ia'
export interface Agent {
  id: string;
  name: string;
  code: string;
  description: string;
  model: ModelIA;
  modelId: string;
  skills: string[];
  abilities: string[];
  personality: string;
  url: string;
  detailsUrl: string;
  tenant: Tenant;
  tenantId: string;
  isActive: boolean;
  monthlyTokenLimit: number;
}