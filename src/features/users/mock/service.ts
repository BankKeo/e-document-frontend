import { MOCK_DEPARTMENTS, MOCK_ROLES, MOCK_USERS } from "./data";
import type { Department, Role, User, UserStatus } from "../types";
import type { CreateUserInput, EditUserInput } from "../schemas/user.schema";

function delay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomId() {
  return `usr_${Math.random().toString(36).slice(2, 9)}`;
}

// In-memory mock store (resets on full reload — acceptable for a UI sandbox).
// Swap `userService` for real `user.api.ts` calls later; the react-query layer
// in `api/user.queries.ts` stays unchanged.
let users = [...MOCK_USERS];

export const userService = {
  async listUsers(): Promise<User[]> {
    await delay();
    return [...users];
  },

  async getUser(id: string): Promise<User> {
    await delay(200);
    const user = users.find((entry) => entry.id === id);
    if (!user) {
      throw new Error("User not found.");
    }
    return { ...user };
  },

  // USER-001 — Create user
  async createUser(input: CreateUserInput): Promise<User> {
    await delay(500);
    const created: User = {
      id: randomId(),
      name: input.name.trim(),
      email: input.email.trim(),
      title: input.title?.trim() || "—",
      role: input.role,
      department: input.department,
      status: "Active",
      createdAt: new Date().toISOString().slice(0, 10),
      lastActiveAt: "Never",
    };
    users = [created, ...users];
    return { ...created };
  },

  // USER-003 — Edit user
  async updateUser(id: string, input: EditUserInput): Promise<User> {
    await delay(500);
    const index = users.findIndex((entry) => entry.id === id);
    if (index === -1) {
      throw new Error("User not found.");
    }
    users[index] = {
      ...users[index],
      name: input.name.trim(),
      title: input.title?.trim() || "—",
      role: input.role,
      department: input.department,
    };
    return { ...users[index] };
  },

  // USER-004 — Disable user
  async disableUser(id: string): Promise<User> {
    await delay();
    return setStatus(id, "Disabled");
  },

  // USER-005 — Activate user
  async activateUser(id: string): Promise<User> {
    await delay();
    return setStatus(id, "Active");
  },

  // USER-006 — Assign role
  async assignRole(id: string, role: string): Promise<User> {
    await delay();
    const user = getMutable(id);
    user.role = role;
    return { ...user };
  },

  // USER-007 — Assign department
  async assignDepartment(id: string, department: string): Promise<User> {
    await delay();
    const user = getMutable(id);
    user.department = department;
    return { ...user };
  },

  async listRoles(): Promise<Role[]> {
    await delay(150);
    return [...MOCK_ROLES];
  },

  async listDepartments(): Promise<Department[]> {
    await delay(150);
    return [...MOCK_DEPARTMENTS];
  },
};

function getMutable(id: string): User {
  const index = users.findIndex((entry) => entry.id === id);
  if (index === -1) {
    throw new Error("User not found.");
  }
  return users[index];
}

async function setStatus(id: string, status: UserStatus): Promise<User> {
  const user = getMutable(id);
  user.status = status;
  return { ...user };
}