import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateSVAS6 } from '@/lib/svas-algorithm';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const dbData = await prisma.screeningRecord.findMany({
      orderBy: { date: 'desc' },
      include: { user: true }
    });

    // Map Prisma schema to expected frontend format
    const formattedData = dbData.map((item: any) => {
      const input = {
        svasScores: [
          item.q1_salience,
          item.q2_mood,
          item.q3_tolerance,
          item.q4_withdrawal,
          item.q5_conflict,
          item.q6_relapse,
        ],
        platforms: {
          instagram: item.instagramHours,
          tiktok: item.tiktokHours,
          youtube: item.youtubeHours,
          twitter: item.twitterHours,
        },
        sleepHours: item.sleepHours,
        productivityImpact: item.productivityImpact,
      };

      const result = calculateSVAS6(input);

      return {
        id: item.UserID_hash,
        createdAt: item.date,
        userName: item.user?.Username || 'Unknown',
        input,
        result
      };
    });

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

    await prisma.screeningRecord.delete({
      where: { UserID_hash: id }
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

    const result = await prisma.screeningRecord.findUnique({ where: { UserID_hash: id } });
    if (result) {
      try {
        await prisma.user.update({
          where: { UserID: result.userId },
          data: { Username: userName }
        });
      } catch (e) {
        // user might not exist
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update result:', error);
    return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 500 });
  }
}
