export interface NetflixHistoryItem {
  title: string;
  date: string;
  duration: number;
  deviceType: string;
  country: string;
  type: string;
}

export async function getAllHistory(): Promise<NetflixHistoryItem[]> {
  const response = await fetch('/api/history');
  if (!response.ok) {
    throw new Error('Failed to fetch history');
  }
  return response.json();
}

export async function getHistoryByType(type: string): Promise<NetflixHistoryItem[]> {
  const response = await fetch(`/api/history/${type}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch history for type ${type}`);
  }
  return response.json();
}
