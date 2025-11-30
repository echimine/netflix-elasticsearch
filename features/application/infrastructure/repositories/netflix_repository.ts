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
        // Split search into words for better matching
        const searchWords = filters.search.toLowerCase().split(' ').filter(w => w.length > 0);
        
        mustClauses.push({
          bool: {
            should: searchWords.map(word => ({
              wildcard: {
                title: {
                  value: `*${word}*`,
                  case_insensitive: true,
                },
              },
            })),
            minimum_should_match: searchWords.length,
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
  async getHistoryByProfile(
    profileName: string,
    limit: number = 1000
  ): Promise<NetflixHistoryItem[]> {
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
          size: 10000, // get all documents to extract unique profiles
        },
      });

      const items = result.hits.hits.map((hit: any) => hit._source as NetflixHistoryItem);
      const uniqueProfiles = [...new Set(items.map((item) => item.profileName))];
      // Filter out null, undefined, and empty strings
      return uniqueProfiles.filter((profile) => profile && profile.trim() !== '');
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw new Error('Failed to fetch profiles');
    }
  }

  // Content detail methods
  /**
   * Retrieves history for a specific title.
   * Uses a multi-step search approach:
   * 1. Exact match on keyword field.
   * 2. Fallback to match query if exact match fails.
   * 3. If it's a TV Show, attempts to find all episodes of the series.
   */
  async getHistoryByTitle(title: string): Promise<NetflixHistoryItem[]> {
    try {
      // First, try exact match
      let result = await client.search({
        index: 'historic_netflix',
        body: {
          query: {
            term: {
              'title.keyword': title,
            },
          },
          size: 10000,
        },
      });

      let items = result.hits.hits.map((hit: any) => hit._source as NetflixHistoryItem);

      // If no exact match found, try with match query (more flexible)
      if (items.length === 0) {
        result = await client.search({
          index: 'historic_netflix',
          body: {
            query: {
              match: {
                title: {
                  query: title,
                  operator: 'and',
                },
              },
            },
            size: 10000,
          },
        });

        items = result.hits.hits.map((hit: any) => hit._source as NetflixHistoryItem);
      }

      // If we found results and it's a TV show, try to get all episodes of the series
      // This is necessary because the input title might be a specific episode (e.g. "Series: S1 E1")
      // and we want to show the context of the whole series.
      if (items.length > 0 && items[0]?.type === 'TV Show') {
        // Extract base series name by removing episode/season info
        let baseSeriesName = title
          .replace(/\s*:\s*(Saison|Season)\s+\d+.*$/i, '')
          .replace(/\s*:\s*(Épisode|Episode).*$/i, '')
          .replace(/\s*\(.*\)$/g, '')
          .replace(/\s*-\s*(Saison|Season).*$/i, '')
          .trim();

        console.log(`Extracted base series name: "${baseSeriesName}" from "${title}"`);

        // Search for all episodes with this base name
        const seriesResult = await client.search({
          index: 'historic_netflix',
          body: {
            query: {
              bool: {
                must: [
                  {
                    match: {
                      title: {
                        query: baseSeriesName,
                        operator: 'and',
                      },
                    },
                  },
                  { term: { 'type.keyword': 'TV Show' } },
                ],
              },
            },
            size: 10000,
          },
        });

        const allEpisodes = seriesResult.hits.hits.map(
          (hit: any) => hit._source as NetflixHistoryItem
        );

        console.log(`Found ${allEpisodes.length} episodes for series "${baseSeriesName}"`);

        // Return all episodes if we found more than just the original item
        if (allEpisodes.length > items.length) {
          return allEpisodes;
        }
      }

      return items;
    } catch (error) {
      console.error(`Error fetching history for title "${title}":`, error);
      throw new Error(`Failed to fetch history for title "${title}"`);
    }
  }
  async getAvailableYears(): Promise<number[]> {
    try {
      const result = await client.search({
        index: 'historic_netflix',
        body: {
          size: 0,
          aggs: {
            years: {
              date_histogram: {
                field: 'date',
                calendar_interval: 'year',
                format: 'yyyy',
                order: { _key: 'desc' },
              },
            },
          },
        },
      });

      const buckets = (result.aggregations?.years as any).buckets;
      return buckets.map((bucket: any) => parseInt(bucket.key_as_string));
    } catch (error) {
      console.error('Error fetching available years:', error);
      throw new Error('Failed to fetch available years');
    }
  }

  /**
   * Aggregates statistics for a specific profile.
   * Calculates:
   * - Total duration watched
   * - Distribution by type (Movie/TV Show)
   * - Top 5 movies and series
   * - Activity over time (monthly)
   * - Activity by hour of day
   */
  async getProfileStats(profileName: string): Promise<any> {
    try {
      const result = await client.search({
        index: 'historic_netflix',
        body: {
          size: 0,
          query: {
            term: {
              'profileName.keyword': profileName,
            },
          },
          aggs: {
            total_duration: { sum: { field: 'duration' } },
            by_type: { terms: { field: 'type.keyword' } },
            top_movies: {
              filter: { term: { 'type.keyword': 'Movie' } },
              aggs: {
                titles: { terms: { field: 'title.keyword', size: 5 } },
              },
            },
            top_series: {
              filter: { term: { 'type.keyword': 'TV Show' } },
              aggs: {
                titles: { terms: { field: 'title.keyword', size: 5 } },
              },
            },
            activity_over_time: {
              date_histogram: {
                field: 'date',
                calendar_interval: 'month',
                format: 'yyyy-MM',
              },
            },
            activity_by_hour: {
              terms: {
                script: "doc['date'].value.getHour()",
                size: 24,
                order: { _key: 'asc' },
              },
            },
          },
        },
      });

      return result.aggregations;
    } catch (error) {
      console.error(`Error fetching stats for profile "${profileName}":`, error);
      throw new Error(`Failed to fetch stats for profile "${profileName}"`);
    }
  }
}
