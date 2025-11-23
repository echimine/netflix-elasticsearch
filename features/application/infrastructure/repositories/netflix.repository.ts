import { client } from '../../../../client/elastic-search-client';

export interface NetflixHistoryItem {
  title: string;
  date: string;
  duration: number;
  deviceType: string;
  country: string;
  type: string;
  profileName: string;
}

export class NetflixRepository {
  async getAllNetflixHistory(limit: number = 100): Promise<NetflixHistoryItem[]> {
    try {
      const result = await client.search({
        index: 'historic_netflix',
        body: {
          query: {
            match_all: {},
          },
          size: limit,
          sort: [{ date: { order: 'desc' } }],
        },
      });

      return result.hits.hits.map((hit: any) => hit._source as NetflixHistoryItem);
    } catch (error) {
      console.error('Error fetching Netflix history:', error);
      throw new Error('Failed to fetch Netflix history');
    }
  }

  async getHistoryByType(type: string, limit: number = 100): Promise<NetflixHistoryItem[]> {
    try {
      const result = await client.search({
        index: 'historic_netflix',
        body: {
          query: {
            term: {
              'type.keyword': type,
            },
          },
          size: limit,
          sort: [{ date: { order: 'desc' } }],
        },
      });

      return result.hits.hits.map((hit: any) => hit._source as NetflixHistoryItem);
    } catch (error) {
      console.error(`Error fetching Netflix history for type ${type}:`, error);
      throw new Error(`Failed to fetch Netflix history for type ${type}`);
    }
  }

  // Catalogue methods
  async searchByTitle(query: string, limit: number = 100): Promise<NetflixHistoryItem[]> {
    try {
      const result = await client.search({
        index: 'historic_netflix',
        body: {
          query: {
            match: {
              title: query,
            },
          },
          size: limit,
        },
      });

      return result.hits.hits.map((hit: any) => hit._source as NetflixHistoryItem);
    } catch (error) {
      console.error(`Error searching by title "${query}":`, error);
      throw new Error(`Failed to search by title "${query}"`);
    }
  }

  async getHistoryByYear(year: number, limit: number = 100): Promise<NetflixHistoryItem[]> {
    try {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31T23:59:59`;

      const result = await client.search({
        index: 'historic_netflix',
        body: {
          query: {
            range: {
              date: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
          size: limit,
        },
      });

      return result.hits.hits.map((hit: any) => hit._source as NetflixHistoryItem);
    } catch (error) {
      console.error(`Error fetching history for year ${year}:`, error);
      throw new Error(`Failed to fetch history for year ${year}`);
    }
  }

  async getHistoryByFilters(
    filters: {
      type?: string;
      year?: number;
      search?: string;
    },
    limit: number = 100
  ): Promise<NetflixHistoryItem[]> {
    try {
      const mustClauses: any[] = [];

      if (filters.type) {
        mustClauses.push({
          term: {
            'type.keyword': filters.type,
          },
        });
      }

      if (filters.year) {
        const startDate = `${filters.year}-01-01`;
        const endDate = `${filters.year}-12-31T23:59:59`;
        mustClauses.push({
          range: {
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
        });
      }

      if (filters.search) {
        mustClauses.push({
          match: {
            title: filters.search,
          },
        });
      }

      const query = mustClauses.length > 0 ? { bool: { must: mustClauses } } : { match_all: {} };

      const result = await client.search({
        index: 'historic_netflix',
        body: {
          query,
          size: limit,
        },
      });

      return result.hits.hits.map((hit: any) => hit._source as NetflixHistoryItem);
    } catch (error) {
      console.error('Error fetching history with filters:', error);
      throw new Error('Failed to fetch history with filters');
    }
  }

  // Profile methods
  async getHistoryByProfile(profileName: string, limit: number = 1000): Promise<NetflixHistoryItem[]> {
    try {
      const result = await client.search({
        index: 'historic_netflix',
        body: {
          query: {
            term: {
              'profileName.keyword': profileName,
            },
          },
          size: limit,
        },
      });

      return result.hits.hits.map((hit: any) => hit._source as NetflixHistoryItem);
    } catch (error) {
      console.error(`Error fetching history for profile "${profileName}":`, error);
      throw new Error(`Failed to fetch history for profile "${profileName}"`);
    }
  }

  async getProfiles(): Promise<string[]> {
    try {
      const result = await client.search({
        index: 'historic_netflix',
        body: {
          query: {
            match_all: {},
          },
          size: 10000, // Get all documents to extract unique profiles
        },
      });

      const items = result.hits.hits.map((hit: any) => hit._source as NetflixHistoryItem);
      const uniqueProfiles = [...new Set(items.map((item) => item.profileName))];
      return uniqueProfiles;
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw new Error('Failed to fetch profiles');
    }
  }

  // Content detail methods
  async getHistoryByTitle(title: string): Promise<NetflixHistoryItem[]> {
    try {
      const result = await client.search({
        index: 'historic_netflix',
        body: {
          query: {
            term: {
              'title.keyword': title,
            },
          },
          size: 1000,
        },
      });

      return result.hits.hits.map((hit: any) => hit._source as NetflixHistoryItem);
    } catch (error) {
      console.error(`Error fetching history for title "${title}":`, error);
      throw new Error(`Failed to fetch history for title "${title}"`);
    }
  }
}
