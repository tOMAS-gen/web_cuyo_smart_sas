import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas públicas dentro del área admin
  if (pathname === '/admin/login') return NextResponse.next();
  if (pathname.startsWith('/api/auth/')) return NextResponse.next();

  // Proteger rutas admin y API de presupuestos
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/presupuestos')) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;

    if (!token || !(await verifySessionToken(token))) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/presupuestos/:path*', '/api/auth/:path*'],
};
