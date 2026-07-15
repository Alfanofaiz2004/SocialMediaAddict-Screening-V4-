import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { Username, input, result } = data;

    if (!Username || !input || !result) {
      return NextResponse.json({ success: false, error: 'Missing data' }, { status: 400 });
    }

    // Upsert User based on Username
    const user = await prisma.user.upsert({
      where: { Username: Username },
      update: {},
      create: { Username: Username },
    });

    const newResult = await prisma.assessmentResult.create({
      data: {
        Username: Username,
        overallScore: `(${result.svasTotal}/30)`,
        zone: result.zone,
        svasTotal: result.svasTotal,
        rawInput: input,
        rawResult: result,
      },
    });

    return NextResponse.json({ success: true, id: newResult.UserID });
  } catch (error) {
    console.error('Results save error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
