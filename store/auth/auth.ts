export enum Role {
  Admin = "Admin",
  SuperAdmin = "Super Admin",
  Specialist = "Coach",
}

export type JwtPayload = {
  sub: string;
};

export type Credentials = {
  email?: string;
  password?: string;
  username?: string;
};

export type User = {
  id?: string;
  firstName?: string;
  lastName?: string;
  documentId?: string;
  email?: string;
  password?: string;
};

export type Profile = {
  id: string;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  access_token?: string;
};
