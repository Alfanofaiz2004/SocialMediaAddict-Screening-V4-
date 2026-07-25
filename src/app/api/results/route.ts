import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { Username, input, result } = data;

    if (!Username || typeof Username !== 'string' || !input || !result) {
      return NextResponse.json({ success: false, error: 'Data tidak lengkap' }, { status: 400 });
    }

    const cleanUsername = Username.trim().slice(0, 50);
    if (!cleanUsername) {
      return NextResponse.json({ success: false, error: 'Nama pengguna tidak valid' }, { status: 400 });
    }

    // Validate svasScores array
    if (!Array.isArray(input.svasScores) || input.svasScores.length !== 6) {
      return NextResponse.json({ success: false, error: 'Skor S-VAS tidak valid' }, { status: 400 });
    }

    // Validate each score is between 1 and 5
    const validatedScores = input.svasScores.map((s: any) => {
      const num = Number(s);
      return isNaN(num) ? 1 : Math.max(1, Math.min(5, Math.round(num)));
    });

    // Validate hours & numerical inputs
    const clampNumber = (val: any, min: number, max: number, defaultVal: number) => {
      const num = Number(val);
      if (isNaN(num)) return defaultVal;
      return Math.max(min, Math.min(max, num));
    };

    const sleepHours = clampNumber(input.sleepHours, 0, 24, 7);
    const productivityImpact = clampNumber(input.productivityImpact, 1, 10, 5);

    const platforms = input.platforms || {};
    const instagramHours = clampNumber(platforms.instagram, 0, 24, 0);
    const tiktokHours = clampNumber(platforms.tiktok, 0, 24, 0);
    const youtubeHours = clampNumber(platforms.youtube, 0, 24, 0);
    const twitterHours = clampNumber(platforms.twitter, 0, 24, 0);
    const totalDuration = instagramHours + tiktokHours + youtubeHours + twitterHours;

    // Upsert User based on Username
    const user = await prisma.user.upsert({
      where: { Username: cleanUsername },
      update: {},
      create: { Username: cleanUsername },
    });

    const calculatedTotal = validatedScores.reduce((a, b) => a + b, 0);
    let assignedZone = result.zone || 'SEHAT';
    if (!['SEHAT', 'BERISIKO', 'KECANDUAN'].includes(assignedZone)) {
      assignedZone = calculatedTotal <= 14 ? 'SEHAT' : calculatedTotal <= 18 ? 'BERISIKO' : 'KECANDUAN';
    }

    const newResult = await prisma.screeningRecord.create({
      data: {
        userId: user.UserID,
        zone: assignedZone,
        svasTotal: calculatedTotal,
        q1_salience: validatedScores[0],
        q2_mood: validatedScores[1],
        q3_tolerance: validatedScores[2],
        q4_withdrawal: validatedScores[3],
        q5_conflict: validatedScores[4],
        q6_relapse: validatedScores[5],
        socialMediaHours: totalDuration,
        sleepHours: sleepHours,
        productivityImpact: productivityImpact,
        instagramHours: instagramHours,
        tiktokHours: tiktokHours,
        youtubeHours: youtubeHours,
        twitterHours: twitterHours,
      },
    });

    return NextResponse.json({ success: true, id: newResult.UserID_hash });
  } catch (error) {
    console.error('Results save error:', error);
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
