'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye, Calendar } from 'lucide-react';
import type { CatalogueItem } from '@/features/application/use-cases/get-catalogue.use-case';

interface CatalogueGridProps {
  items: CatalogueItem[];
  isLoading: boolean;
}

export function CatalogueGrid({ items, isLoading }: CatalogueGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="bg-muted/50 h-24" />
            <CardContent className="h-24" />
          </Card>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground">No items found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <a
          key={item.title}
          href={`/content/${encodeURIComponent(item.title)}`}
          className="block transition-transform hover:scale-105"
        >
          <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="line-clamp-2 text-lg font-medium" title={item.title}>
                  {item.title}
                </CardTitle>
                <Badge variant={item.type === 'Movie' ? 'default' : 'secondary'}>{item.type}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground grid gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>First watched: {new Date(item.firstViewedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{item.totalViews} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{Math.round(item.totalDuration / 60)} mins watched</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  );
}
