'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { NetflixHistoryItem } from '@/lib/api';
import { formatDuration } from '@/lib/formatters';

interface TopContentCardProps {
  items: NetflixHistoryItem[];
}

export function TopContentCard({ items }: TopContentCardProps) {
  const contentCounts = items.reduce(
    (acc, item) => {
      const key = item.title;
      if (!acc[key]) {
        acc[key] = { count: 0, duration: 0, type: item.type };
      }
      acc[key].count++;
      acc[key].duration += item.duration;
      return acc;
    },
    {} as Record<string, { count: number; duration: number; type: string }>
  );

  const topContent = Object.entries(contentCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Most Watched</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topContent.map(([title, data], index) => (
            <div key={title} className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    #{index + 1}
                  </span>
                  <p className="text-sm font-medium truncate">{title}</p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {data.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {data.count} view{data.count > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <span className="text-sm font-medium">
                {formatDuration(data.duration)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
