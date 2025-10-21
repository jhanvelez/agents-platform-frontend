import { City } from "./locations"
import { Plan } from "./plan"

export interface Tenant {
  id: string;
  name: string;
  documentType: string;
  documentNumber: string;
  email: string;
  address: string;
  department: string;
  city: City;
  plan: Plan;
  monthlyTokenLimit: number;
  active: boolean;
}