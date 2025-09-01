import { City } from "./locations"

export interface Tenant {
  id: string;
  name: string;
  documentType: string;
  documentNumber: string;
  email: string;
  address: string;
  department: string;
  city: City;
  plan: string;
  monthlyTokenLimit: number;
  isActive: boolean;
}