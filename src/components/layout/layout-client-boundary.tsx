
"use client"; // This is a Client Component

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Header } from './header';
import { Footer } from './footer';
import { Toaster } from '../ui/toaster';

export default function LayoutClientBoundary({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showFooter = pathname !== '/workout-chat';

  return (
    <>
      <Header />
      <main className="flex-grow flex flex-col">{children}</main>
      {showFooter && <Footer />}
      <Toaster />
    </>
  );
}
