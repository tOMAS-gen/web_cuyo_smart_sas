import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE = 'cuyo_admin_session';
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 horas en segundos

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET no configurado');
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ sub: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export function verifyCredentials(username: string, password: string): boolean {
  const adminUser = process.env.ADMIN_USERNAME;
  const adminPass = process.env.ADMIN_PASSWORD;
  if (!adminUser || !adminPass) return false;
  // Comparación constante para prevenir timing attacks
  const userMatch = username.length === adminUser.length && username === adminUser;
  const passMatch = password.length === adminPass.length && password === adminPass;
  return userMatch && passMatch;
}
