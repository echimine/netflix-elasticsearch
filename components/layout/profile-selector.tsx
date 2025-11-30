'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserCircle } from 'lucide-react';

export function ProfileSelector() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch('/api/profiles');
        if (response.ok) {
          const data = await response.json();
          setProfiles(data);
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleProfileChange = (value: string) => {
    router.push(`/profile/${encodeURIComponent(value)}`);
  };

  if (loading) {
    return <div className="bg-muted h-10 w-[180px] animate-pulse rounded-md" />;
  }

  return (
    <div className="flex items-center gap-2">
      <UserCircle className="text-muted-foreground h-5 w-5" />
      <Select onValueChange={handleProfileChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Profile" />
        </SelectTrigger>
        <SelectContent>
          {profiles.map((profile) => (
            <SelectItem key={profile} value={profile}>
              {profile}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
