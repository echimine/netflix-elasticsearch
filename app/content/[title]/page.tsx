'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Clock, Calendar, Users, Tv, Film } from 'lucide-react';
import type {
  ContentDetails,
  EpisodeInfo,
  SeasonInfo,
} from '@/features/application/use-cases/get-content-details.use-case';
import { formatDurationShort, formatDuration } from '@/lib/formatters';

export default function ContentDetailPage({ params }: { params: Promise<{ title: string }> }) {
  const { title } = use(params);
  const contentTitle = decodeURIComponent(title);
  const [content, setContent] = useState<ContentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/content/${encodeURIComponent(contentTitle)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch content details');
        }
        const data = await response.json();
        setContent(data);
      } catch (err) {
        setError('Error loading content details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [contentTitle]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-2xl font-bold">Loading content details...</div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-red-500">{error || 'Content not found'}</div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="bg-secondary hover:bg-secondary/80 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Title Section */}
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white">{content.title}</h1>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant={content.type === 'Movie' ? 'default' : 'secondary'}>
                  {content.type}
                </Badge>
                {content.type === 'Movie' && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      {formatDurationShort(Math.floor(content.totalDuration / content.totalViews))}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      {new Date(content.firstViewedDate).getFullYear()}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                {content.type === 'Movie' ? (
                  <Film className="text-chart-2 h-4 w-4" />
                ) : (
                  <Tv className="text-chart-3 h-4 w-4" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{content.totalViews}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Watch Time</CardTitle>
                <Clock className="text-primary h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatDurationShort(content.totalDuration)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">First Watched</CardTitle>
                <Calendar className="text-chart-5 h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  {new Date(content.firstViewedDate).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profiles</CardTitle>
                <Users className="text-chart-4 h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{content.uniqueProfiles.length}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="profiles" className="w-full">
          <TabsList className="bg-muted">
            <TabsTrigger value="profiles">Profiles</TabsTrigger>
            {content.type === 'TV Show' && content.seasons && (
              <TabsTrigger value="episodes">Episodes</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="profiles" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profiles Who Watched This</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {content.viewsByProfile.map((profile) => (
                    <div
                      key={profile.profileName}
                      className="bg-muted flex items-center justify-between rounded-lg p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full font-bold">
                          {profile.profileName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{profile.profileName}</div>
                          <div className="text-muted-foreground text-sm">
                            {profile.viewCount} views • {formatDurationShort(profile.totalDuration)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {content.type === 'TV Show' && content.seasons && (
            <TabsContent value="episodes" className="mt-6">
              <div className="space-y-6">
                {content.seasons.map((season) => (
                  <Card key={season.seasonNumber}>
                    <CardHeader>
                      <CardTitle>
                        {season.seasonNumber === 0
                          ? 'Unknown Season'
                          : `Season ${season.seasonNumber}`}
                      </CardTitle>
                      <p className="text-muted-foreground text-sm">
                        {season.episodes.length} episodes
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {season.episodes.map((episode, idx) => (
                          <div
                            key={idx}
                            className="bg-muted flex items-start justify-between rounded-lg p-3"
                          >
                            <div className="flex-1">
                              <div className="font-medium">
                                {episode.episode && `E${episode.episode}: `}
                                {episode.episodeTitle}
                              </div>
                              <div className="text-muted-foreground mt-1 text-sm">
                                Watched by {episode.profileName} •{' '}
                                {new Date(episode.viewedDate).toLocaleDateString()} •{' '}
                                {formatDurationShort(episode.duration)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
