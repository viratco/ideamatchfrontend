// Utility for decoding JWT and checking auth status
import { jwtDecode } from "jwt-decode";

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function getUserId(): string | null {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    return decoded.user_id || decoded.id || null;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}
