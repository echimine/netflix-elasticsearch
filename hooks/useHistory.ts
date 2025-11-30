'use client';

import { useState, useEffect } from 'react';
import { getAllHistory } from '@/lib/api';
import type { NetflixHistoryItem } from '@/lib/api';

export function useHistory() {
  const [data, setData] = useState<NetflixHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        setLoading(true);
        const history = await getAllHistory();
        setData(history);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch history');
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  return { data, loading, error, refetch: () => getAllHistory() };
}
