'use client';

import { Film } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <Film className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Netflix History Viewer</h1>
            <p className="text-sm text-muted-foreground">
              Analyze your Netflix viewing history
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
