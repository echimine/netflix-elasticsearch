import { NextRequest, NextResponse } from 'next/server';
import { GetProfileActivityUseCase } from '@/features/application/use-cases/get-profile-activity.use-case';
import { NetflixRepository } from '@/features/application/infrastructure/repositories/netflix_repository';

export async function GET(request: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  try {
    const { name } = await params;
    const profileName = decodeURIComponent(name);
    const searchParams = request.nextUrl.searchParams;
    const timeframe = (searchParams.get('timeframe') as 'day' | 'week' | 'month') || 'day';

    // Validate timeframe
    if (!['day', 'week', 'month'].includes(timeframe)) {
      return NextResponse.json(
        { error: 'Invalid timeframe parameter. Must be "day", "week", or "month"' },
        { status: 400 }
      );
    }

    const netflixRepository = new NetflixRepository();
    const getProfileActivityUseCase = new GetProfileActivityUseCase(netflixRepository);
    const activity = await getProfileActivityUseCase.execute(profileName, timeframe);

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error in profile activity API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
