import { NextResponse } from 'next/server';
import { GetAllHistoryUseCase } from '@/features/application/use-cases/get-all-history.use-case';
import { NetflixRepository } from '@/features/application/infrastructure/repositories/netflix.repository';

export async function GET() {
  try {
    const netflixRepository = new NetflixRepository();
    const getAllHistoryUseCase = new GetAllHistoryUseCase(netflixRepository);
    const history = await getAllHistoryUseCase.execute();

    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
