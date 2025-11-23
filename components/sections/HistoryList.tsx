'use client';

import type { NetflixHistoryItem } from '@/lib/api';
import { useHistoryFilter } from '@/hooks/useHistoryFilter';
import { HistoryFilter } from '@/components/history/HistoryFilter';
import { HistoryTable } from '@/components/history/HistoryTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface HistoryListProps {
  data: NetflixHistoryItem[];
}

export function HistoryList({ data }: HistoryListProps) {
  const { filters, filteredData, updateFilter, resetFilters } =
    useHistoryFilter(data);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filter History</CardTitle>
          <CardDescription>
            Search and filter your viewing history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HistoryFilter
            filters={filters}
            onFilterChange={updateFilter}
            onReset={resetFilters}
            data={data}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Viewing History</CardTitle>
          <CardDescription>
            Showing {filteredData.length} of {data.length} items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HistoryTable items={filteredData} />
        </CardContent>
      </Card>
    </div>
  );
}
