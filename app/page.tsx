'use client';

import { useState, useEffect } from 'react';
import { CatalogueFilters } from '@/components/catalogue/catalogue-filters';
import { CatalogueGrid } from '@/components/catalogue/catalogue-grid';
import type { CatalogueItem } from '@/features/application/use-cases/get-catalogue.use-case';
import { useDebounce } from '@/hooks/use-debounce';

export default function HomePage() {
  const [items, setItems] = useState<CatalogueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [year, setYear] = useState('all');
  const [years, setYears] = useState<number[]>([]);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch('/api/catalogue/filters');
        if (response.ok) {
          const data = await response.json();
          setYears(data.years);
        }
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchCatalogue = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();

        if (debouncedSearch) {
          params.append('search', debouncedSearch);
        }

        if (type !== 'all') {
          params.append('type', type);
        }

        if (year !== 'all') {
          params.append('year', year);
        }

        const response = await fetch(`/api/catalogue?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch catalogue');

        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching catalogue:', error);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalogue();
  }, [debouncedSearch, type, year]);

  return (
    <div className="min-h-screen">
      <main className="container mx-auto space-y-8 px-4 py-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Catalogue</h1>
          <p className="text-muted-foreground">Explore your complete Netflix viewing history.</p>
        </div>

        <CatalogueFilters
          search={search}
          onSearchChange={setSearch}
          type={type}
          onTypeChange={setType}
          year={year}
          onYearChange={setYear}
          years={years}
        />

        <CatalogueGrid items={items} isLoading={isLoading} />
      </main>
    </div>
  );
}
