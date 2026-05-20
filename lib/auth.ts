const TOKEN_KEY = "uc_group_auth";
const ADMIN_KEY = "uc_admin_auth";

export function isAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(TOKEN_KEY) === "1";
}

export function authenticate(password: string): boolean {
  const expected = process.env.NEXT_PUBLIC_GROUP_PASSWORD ?? "";
  if (!expected || password !== expected) return false;
  window.localStorage.setItem(TOKEN_KEY, "1");
  return true;
}

export function signOut(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}

export function isAdminAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(ADMIN_KEY) === "1";
}

export function adminAuthenticate(password: string): boolean {
  const expected = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "";
  if (!expected || password !== expected) return false;
  window.sessionStorage.setItem(ADMIN_KEY, "1");
  return true;
}

export function adminSignOut(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(ADMIN_KEY);
}
