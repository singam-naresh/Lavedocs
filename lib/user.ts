import { DEFAULT_USER } from './types';

const KEY = 'lavedocs_current_user';

export function getCurrentUser(): string {
  if (typeof window === 'undefined') return DEFAULT_USER;
  return localStorage.getItem(KEY) || DEFAULT_USER;
}

export function setCurrentUser(user: string): void {
  localStorage.setItem(KEY, user);
}
