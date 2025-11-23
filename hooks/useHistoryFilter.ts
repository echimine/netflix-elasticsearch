'use client';

import { useState, useMemo } from 'react';
import { NetflixHistoryItem } from '@/lib/api';

export interface HistoryFilters {
  search: string;
  type: string;
  deviceType: string;
  country: string;
}

export function useHistoryFilter(data: NetflixHistoryItem[]) {
  const [filters, setFilters] = useState<HistoryFilters>({
    search: '',
    type: 'all',
    deviceType: 'all',
    country: 'all',
  });

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        filters.search === '' ||
        item.title.toLowerCase().includes(filters.search.toLowerCase());
      const matchesType = filters.type === 'all' || item.type === filters.type;
      const matchesDevice =
        filters.deviceType === 'all' || item.deviceType === filters.deviceType;
      const matchesCountry =
        filters.country === 'all' || item.country === filters.country;

      return matchesSearch && matchesType && matchesDevice && matchesCountry;
    });
  }, [data, filters]);

  const updateFilter = (key: keyof HistoryFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      deviceType: 'all',
      country: 'all',
    });
  };

  return { filters, filteredData, updateFilter, resetFilters };
}
