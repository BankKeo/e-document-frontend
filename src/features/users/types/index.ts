export type UserStatus = "Active" | "Disabled";

export interface User {
  id: string;
  name: string;
  email: string;
  title: string;
  role: string;
  department: string;
  status: UserStatus;
  createdAt: string;
  lastActiveAt: string;
  phone?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface Department {
  id: string;
  name: string;
}