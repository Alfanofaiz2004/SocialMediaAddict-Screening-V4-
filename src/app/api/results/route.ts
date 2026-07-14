import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ success: false, error: 'Username required' }, { status: 400 });
    }

    const results = await prisma.assessmentResult.findMany({
      where: { username },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error('Results fetch error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { userName, input, result } = data;

    if (!userName || !input || !result) {
      return NextResponse.json({ success: false, error: 'Missing data' }, { status: 400 });
    }

    const newResult = await prisma.assessmentResult.create({
      data: {
        username: userName,
        userId: null,
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

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, username } = data;

    if (!id || !username) {
      return NextResponse.json({ success: false, error: 'Missing id or username' }, { status: 400 });
    }

    const updatedResult = await prisma.assessmentResult.update({
      where: { id },
      data: {
        username: username,
        userId: null,
      },
    });

    return NextResponse.json({ success: true, data: updatedResult });
  } catch (error) {
    console.error('Results update error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
