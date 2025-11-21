import { client } from '../../../../client/elastic-search-client';

export interface NetflixHistoryItem {
  title: string;
  date: string;
  duration: number;
  deviceType: string;
  country: string;
  type: string;
}

export class NetflixRepository {
  async getAllNetflixHistory(): Promise<NetflixHistoryItem[]> {
    try {
      const result = await client.search({
        index: 'historic_netflix',
        body: {
          query: {
            match_all: {},
          },
          size: 30,
        },
      });

      return result.hits.hits.map((hit: any) => hit._source as NetflixHistoryItem);
    } catch (error) {
      console.error('Error fetching Netflix history:', error);
      throw new Error('Failed to fetch Netflix history');
    }
  }

  async getHistoryByType(type: string): Promise<NetflixHistoryItem[]> {
    try {
      const result = await client.search({
        index: 'historic_netflix',
        body: {
          query: {
            term: {
              'type.keyword': type,
            },
          },
          size: 30,
        },
      });

      return result.hits.hits.map((hit: any) => hit._source as NetflixHistoryItem);
    } catch (error) {
      console.error(`Error fetching Netflix history for type ${type}:`, error);
      throw new Error(`Failed to fetch Netflix history for type ${type}`);
    }
  }
}
