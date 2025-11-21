import { NextResponse } from 'next/server';
import { GetHistoryByTypeUseCase } from '@/features/application/use-cases/get-history-by-type.use-case';
import { NetflixRepository } from '@/features/application/infrastructure/repositories/netflix.repository';

export async function GET(request: Request, { params }: { params: Promise<{ type: string }> }) {
  try {
    const { type } = await params;
    const netflixRepository = new NetflixRepository();
    const getHistoryByTypeUseCase = new GetHistoryByTypeUseCase(netflixRepository);
    const history = await getHistoryByTypeUseCase.execute(type);

    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
