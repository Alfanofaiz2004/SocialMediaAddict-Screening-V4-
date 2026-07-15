import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { respondentName, input, result } = data;

    if (!respondentName || !input || !result) {
      return NextResponse.json({ success: false, error: 'Missing data' }, { status: 400 });
    }

    const newResult = await prisma.assessmentResult.create({
      data: {
        respondentName: respondentName,
        overallScore: `(${result.svasTotal}/30)`,
        zone: result.zone,
        svasTotal: result.svasTotal,
        rawInput: input,
        rawResult: result,
      },
    });

    return NextResponse.json({ success: true, id: newResult.id });
  } catch (error) {
    console.error('Results save error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
