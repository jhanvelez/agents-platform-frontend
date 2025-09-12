
import { Tenant } from './tenant'
export interface Agent {
  id: string;
  name: string
  description: string
  model: string
  skills: string[]
  abilities: string
  personality: string
  chatUrl: string
  detailsUrl: string
  tenant: Tenant
  isActive: boolean
}