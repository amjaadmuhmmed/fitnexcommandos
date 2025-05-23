"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Dumbbell } from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { cn } from '../../lib/utils';

const navItems = [
  { href: '#hero', label: 'Home' },
  { href: '#programs', label: 'Programs' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#workout-ai', label: 'Workout AI' },
  { href: '#blog', label: 'Blog' },
  { href: '#contact', label: 'Contact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-lg font-bold text-primary hover:text-primary/80 transition-colors">
          <Dumbbell className="h-7 w-7 text-accent" />
          <span>Fitnex Commandos</span>
        </Link>

        <nav className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-6">
              <div className="flex flex-col space-y-6">
                <Link href="/" className="flex items-center space-x-2 text-lg font-bold text-primary" onClick={() => setMobileMenuOpen(false)}>
                  <Dumbbell className="h-7 w-7 text-accent" />
                  <span>Fitnex Commandos</span>
                </Link>
                <nav className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-base font-medium text-foreground hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
