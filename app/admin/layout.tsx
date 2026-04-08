'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

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
    <header className="bg-[#0B1C3E] text-white shadow-lg print:hidden">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/admin" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image
            src="/brand/logo_name_completo_horizontal.svg"
            alt="CuyoSmart SAS"
            width={160}
            height={40}
            className="h-9 w-auto brightness-0 invert"
          />
          <span className="text-[#FF9000] font-semibold text-sm hidden sm:block">
            Panel de Presupuestos
          </span>
        </Link>
        {!isLogin && (
          <div className="flex items-center gap-3">
            <Link
              href="/admin/nuevo"
              className="bg-[#FF9000] hover:bg-[#e68000] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              + Nuevo
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
