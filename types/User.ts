import { Rol } from "./Rol"

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  documentId: string;
  documentType: string; 
  email: string;
  phoneNumber: number; 
  serviceStartSate: string;
  password?: string;
  isActive: boolean;
  roles: [];
}

export interface UserAgent {
  id: string;
  firstName: string;
  lastName: string;
  roles: Rol[];
  hasAccess: boolean;
}