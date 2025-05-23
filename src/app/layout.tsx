
// This file is now a Server Component
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '../lib/utils';
import LayoutClientBoundary from '../components/layout/layout-client-boundary';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Metadata is now correctly exported from a Server Component
export const metadata: Metadata = {
  title: 'Fitnex Commandos',
  description: 'Your journey to a healthier life starts here.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={cn(
          `${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-full`,
          'font-sans'
        )}
      >
        <LayoutClientBoundary>{children}</LayoutClientBoundary>
      </body>
    </html>
  );
}
