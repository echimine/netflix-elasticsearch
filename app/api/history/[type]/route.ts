import { NextRequest, NextResponse } from 'next/server';
import { GetHistoryByTypeUseCase } from '@/features/application/use-cases/get-history-by-type.use-case';
import { NetflixRepository } from '@/features/application/infrastructure/repositories/netflix_repository';

export async function GET(request: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  try {
    const { type } = await params;
    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 100;

    // Validate type
    if (type !== 'Movie' && type !== 'TV Show') {
      return NextResponse.json(
        { error: 'Invalid type parameter. Must be "Movie" or "TV Show"' },
        { status: 400 }
      );
    }

    // Validate limit
    if (isNaN(limit) || limit < 1 || limit > 10000) {
      return NextResponse.json(
        { error: 'Invalid limit parameter. Must be between 1 and 10000' },
        { status: 400 }
      );
    }

    const netflixRepository = new NetflixRepository();
    const getHistoryByTypeUseCase = new GetHistoryByTypeUseCase(netflixRepository);
    const history = await getHistoryByTypeUseCase.execute(type, limit);

    return NextResponse.json(history);
  } catch (error) {
    console.error('Error in history by type API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
