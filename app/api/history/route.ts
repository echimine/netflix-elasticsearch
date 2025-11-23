import { NextRequest, NextResponse } from 'next/server';
import { GetAllHistoryUseCase } from '@/features/application/use-cases/get-all-history.use-case';
import { NetflixRepository } from '@/features/application/infrastructure/repositories/netflix.repository';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 100;

    // Validate limit
    if (isNaN(limit) || limit < 1 || limit > 10000) {
      return NextResponse.json({ error: 'Invalid limit parameter. Must be between 1 and 10000' }, { status: 400 });
    }

    const netflixRepository = new NetflixRepository();
    const getAllHistoryUseCase = new GetAllHistoryUseCase(netflixRepository);
    const history = await getAllHistoryUseCase.execute(limit);

    return NextResponse.json(history);
  } catch (error) {
    console.error('Error in history API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
