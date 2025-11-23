import { NextRequest, NextResponse } from 'next/server';
import { GetProfileTopContentUseCase } from '@/features/application/use-cases/get-profile-top-content.use-case';
import { NetflixRepository } from '@/features/application/infrastructure/repositories/netflix.repository';

export async function GET(request: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  try {
    const { name } = await params;
    const profileName = decodeURIComponent(name);
    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 10;

    // Validate limit
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json({ error: 'Invalid limit parameter. Must be between 1 and 100' }, { status: 400 });
    }

    const netflixRepository = new NetflixRepository();
    const getProfileTopContentUseCase = new GetProfileTopContentUseCase(netflixRepository);
    const topContent = await getProfileTopContentUseCase.execute(profileName, limit);

    return NextResponse.json(topContent);
  } catch (error) {
    console.error('Error in profile top content API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
