export type JwtPayload = {
  sub?: string;
  email?: string;
  exp?: number;
  iat?: number;
};

export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const decoded = JSON.parse(atob(padded)) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string | null | undefined, skewSeconds = 30): boolean {
  if (!token) return true;

  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now + skewSeconds;
}
