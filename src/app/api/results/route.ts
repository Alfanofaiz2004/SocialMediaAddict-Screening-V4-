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
        userId: user.UserID,
        zone: result.zone,
        svasTotal: result.svasTotal,
        q1_salience: input.svasScores[0] ?? 0,
        q2_mood: input.svasScores[1] ?? 0,
        q3_tolerance: input.svasScores[2] ?? 0,
        q4_withdrawal: input.svasScores[3] ?? 0,
        q5_conflict: input.svasScores[4] ?? 0,
        q6_relapse: input.svasScores[5] ?? 0,
        socialMediaHours: result.contextScores.totalDuration ?? 0,
        sleepHours: input.sleepHours ?? 0,
        productivityImpact: input.productivityImpact ?? 0,
        instagramHours: input.platforms.instagram ?? 0,
        tiktokHours: input.platforms.tiktok ?? 0,
        youtubeHours: input.platforms.youtube ?? 0,
        twitterHours: input.platforms.twitter ?? 0,
      },
    });

    return NextResponse.json({ success: true, id: newResult.UserID });
  } catch (error) {
    console.error('Results save error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
