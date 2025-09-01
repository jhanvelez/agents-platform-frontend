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
  roles: [];
}