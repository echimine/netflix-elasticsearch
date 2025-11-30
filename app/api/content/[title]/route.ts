import { NextRequest, NextResponse } from 'next/server';
import { GetContentDetailsUseCase } from '@/features/application/use-cases/get-content-details.use-case';
import { NetflixRepository } from '@/features/application/infrastructure/repositories/netflix_repository';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ title: string }> }
) {
  try {
    const { title: titleParam } = await params;
    const title = decodeURIComponent(titleParam);

    const netflixRepository = new NetflixRepository();
    const getContentDetailsUseCase = new GetContentDetailsUseCase(netflixRepository);
    const contentDetails = await getContentDetailsUseCase.execute(title);

    return NextResponse.json(contentDetails);
  } catch (error: any) {
    console.error('Error in content details API:', error);

    if (error.message && error.message.includes('No viewing history found')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
