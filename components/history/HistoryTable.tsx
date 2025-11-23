'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { NetflixHistoryItem } from '@/lib/api';
import { formatDate, formatDuration } from '@/lib/formatters';

interface HistoryTableProps {
  items: NetflixHistoryItem[];
}

export function HistoryTable({ items }: HistoryTableProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No viewing history found
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>Country</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={`${item.title}-${item.date}-${index}`}>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell>
                <Badge variant={item.type === 'Movie' ? 'default' : 'secondary'}>
                  {item.type}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(item.date)}
              </TableCell>
              <TableCell className="text-sm">
                {formatDuration(item.duration)}
              </TableCell>
              <TableCell className="text-sm">{item.deviceType}</TableCell>
              <TableCell className="text-sm">{item.country}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
