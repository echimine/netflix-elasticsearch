'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserCircle } from 'lucide-react';

export default function ProfileSelectionPage() {
  const [profiles, setProfiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch('/api/profiles');
        if (!response.ok) {
          throw new Error('Failed to fetch profiles');
        }
        const data = await response.json();
        setProfiles(data);
      } catch (err) {
        setError('Error loading profiles');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-2xl font-bold">Loading profiles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-12 text-center text-4xl font-bold tracking-tight text-red-600">
          Who's Watching?
        </h1>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {profiles.map((profile) => (
            <Link key={profile} href={`/profile/${encodeURIComponent(profile)}`}>
              <div className="group flex flex-col items-center gap-4 transition-transform hover:scale-105">
                <div className="flex h-32 w-32 items-center justify-center rounded bg-zinc-800 text-zinc-400 transition-colors group-hover:bg-zinc-700 group-hover:text-white">
                  <UserCircle className="h-20 w-20" />
                </div>
                <span className="text-lg font-medium text-zinc-400 group-hover:text-white">
                  {profile}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
