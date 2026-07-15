import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const dbData = await prisma.assessmentResult.findMany({
      orderBy: { date: 'desc' },
      include: { user: true }
    });

    // Map Prisma schema to expected frontend format
    const formattedData = dbData.map((item: any) => ({
      id: item.id,
      createdAt: item.date,
      userName: item.user?.respondentName || item.respondentName,
      input: item.rawInput,
      result: item.rawResult
    }));

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error) {
    console.error('Failed to fetch results:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ success: false, error: 'Missing ID' }, { status: 400 });

    await prisma.assessmentResult.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete result:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, userName } = await request.json();
    if (!id || !userName) return NextResponse.json({ success: false, error: 'Missing Data' }, { status: 400 });

    const result = await prisma.assessmentResult.findUnique({ where: { id } });
    if (result && result.userId) {
      await prisma.user.update({
        where: { id: result.userId },
        data: { respondentName: userName }
      });
    }

    await prisma.assessmentResult.update({
      where: { id },
      data: { respondentName: userName }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update result:', error);
    return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 500 });
  }
}
