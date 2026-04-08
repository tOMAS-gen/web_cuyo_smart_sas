import { NextRequest, NextResponse } from 'next/server';
import { verifyCredentials, createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/auth';

export async function POST(request: NextRequest) {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 });
  }

  const { username = '', password = '' } = body;

  if (!verifyCredentials(username, password)) {
    // Delay artificial para desalentar fuerza bruta
    await new Promise((r) => setTimeout(r, 500));
    return NextResponse.json({ error: 'Usuario o contraseña incorrectos' }, { status: 401 });
  }

  let token: string;
  try {
    token = await createSessionToken();
  } catch (err) {
    console.error('[auth/login] Error al crear el token de sesión:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });

  return response;
}
