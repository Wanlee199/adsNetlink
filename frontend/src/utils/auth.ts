import type { User, Role } from '../types/auth';

export function hasRole(
  user: User | null | undefined,
  roles: Role | Role[]
): boolean {
  if (!user) return false;
  const required = Array.isArray(roles) ? roles : [roles];
  return user.roles?.some((r) => required.includes(r));
}

export function isManager(user: User | null | undefined): boolean {
  return !!user && user.roles?.includes('MANAGER');
}