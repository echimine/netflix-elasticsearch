'use client';

import Link from 'next/link';
import { Film, BarChart3 } from 'lucide-react';
import { ProfileSelector } from './profile-selector';

export function Header() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <Film className="text-primary h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Netflix History</h1>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-4">
              <Link
                href="/analytics"
                className="text-muted-foreground hover:text-primary flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Link>
            </nav>
            <div className="bg-border h-6 w-px" />
            <ProfileSelector />
          </div>
        </div>
      </div>
    </header>
  );
}
