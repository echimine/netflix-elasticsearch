import { NextRequest, NextResponse } from 'next/server';
import { GetProfileStatsUseCase } from '@/features/application/use-cases/get-profile-stats.use-case';
import { NetflixRepository } from '@/features/application/infrastructure/repositories/netflix_repository';

export async function GET(request: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  try {
    const { name } = await params;
    const profileName = decodeURIComponent(name);

    const netflixRepository = new NetflixRepository();
    const getProfileStatsUseCase = new GetProfileStatsUseCase(netflixRepository);
    const stats = await getProfileStatsUseCase.execute(profileName);

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('Error in profile stats API:', error);

    if (error.message && error.message.includes('No history found')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
