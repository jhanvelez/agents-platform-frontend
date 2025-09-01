import { Permission } from './Permission';

export interface Rol {
  id: string;
  name: string;
  roles: Permission[];
}