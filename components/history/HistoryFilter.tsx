'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import type { HistoryFilters } from '@/hooks/useHistoryFilter';
import { getUniqueValues } from '@/lib/formatters';
import type { NetflixHistoryItem } from '@/lib/api';

interface HistoryFilterProps {
  filters: HistoryFilters;
  onFilterChange: (key: keyof HistoryFilters, value: string) => void;
  onReset: () => void;
  data: NetflixHistoryItem[];
}

export function HistoryFilter({
  filters,
  onFilterChange,
  onReset,
  data,
}: HistoryFilterProps) {
  const types = getUniqueValues(data, 'type');
  const devices = getUniqueValues(data, 'deviceType');
  const countries = getUniqueValues(data, 'country');

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search Title</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Content Type</Label>
          <Select
            value={filters.type}
            onValueChange={(value) => onFilterChange('type', value)}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="device">Device Type</Label>
          <Select
            value={filters.deviceType}
            onValueChange={(value) => onFilterChange('deviceType', value)}
          >
            <SelectTrigger id="device">
              <SelectValue placeholder="All devices" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All devices</SelectItem>
              {devices.map((device) => (
                <SelectItem key={device} value={device}>
                  {device}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select
            value={filters.country}
            onValueChange={(value) => onFilterChange('country', value)}
          >
            <SelectTrigger id="country">
              <SelectValue placeholder="All countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All countries</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {(filters.search ||
        filters.type !== 'all' ||
        filters.deviceType !== 'all' ||
        filters.country !== 'all') && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={onReset}>
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
