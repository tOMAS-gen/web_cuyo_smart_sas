'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/presupuestos', label: 'Presupuestos' },
  { href: '/admin/recibos', label: 'Recibos' },
  { href: '/admin/garantias', label: 'Garantías' },
];

function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  const isLogin = pathname === '/admin/login';

  return (
    // Ocultado en impresión vía `print:hidden` (research.md § 7, FR-014):
    // única convención del panel, sin depender de `.no-print` ni de que haya
    // un ReciboPrint montado. Cabecera, pie y barras de acciones de cada
    // pantalla deben seguir el mismo criterio.
    <header className="bg-primary text-white shadow-lg print:hidden">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/admin" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image
              src="/brand/logo_name_completo_horizontal.svg"
              alt="CuyoSmart SAS"
              width={160}
              height={40}
              className="h-9 w-auto brightness-0 invert"
            />
          </Link>

          {!isLogin && (
            <div className="flex items-center gap-3">
              <Link
                href="/admin/nuevo"
                className="bg-secondary hover:bg-secondary/80 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                + Nuevo presupuesto
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-300 hover:text-white transition-colors px-2 py-2"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>

        {!isLogin && (
          <nav className="flex items-center gap-1 mt-3 -mb-3 overflow-x-auto">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(`${link.href}/`));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`text-sm font-medium px-3 py-2 rounded-t-lg transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-white text-primary'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminHeader />
      <main className="flex-grow">{children}</main>
      <footer className="text-center text-xs text-gray-400 py-4 print:hidden">
        CuyoSmart SAS — Panel Administrativo
      </footer>
    </div>
  );
}
