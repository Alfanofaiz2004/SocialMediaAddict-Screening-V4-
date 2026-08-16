import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateSVAS6 } from '@/lib/svas-algorithm';
import { isAuthenticatedAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// ── GET: Fetch All Results (Protected) ──────────────────────────────────────
export async function GET(request: Request) {
  try {
    const isAuth = await isAuthenticatedAdmin(request);
    if (!isAuth) {
      return NextResponse.json({ success: false, error: 'Akses ditolak: Anda tidak memiliki izin (Unauthorized)' }, { status: 401 });
    }

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
          facebook: item.facebookHours ?? item.twitterHours ?? 0,
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
    console.error('Failed to fetch admin results:', error);
    return NextResponse.json({ success: false, error: 'Gagal mengambil data' }, { status: 500 });
  }
}

// ── DELETE: Remove Result Record (Protected) ────────────────────────────────
export async function DELETE(request: Request) {
  try {
    const isAuth = await isAuthenticatedAdmin(request);
    if (!isAuth) {
      return NextResponse.json({ success: false, error: 'Akses ditolak: Anda tidak memiliki izin (Unauthorized)' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ success: false, error: 'ID tidak valid' }, { status: 400 });
    }

    await prisma.screeningRecord.delete({
      where: { UserID_hash: id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete result:', error);
    return NextResponse.json({ success: false, error: 'Gagal menghapus data' }, { status: 500 });
  }
}

// ── PUT: Update Record User Name (Protected) ────────────────────────────────
export async function PUT(request: Request) {
  try {
    const isAuth = await isAuthenticatedAdmin(request);
    if (!isAuth) {
      return NextResponse.json({ success: false, error: 'Akses ditolak: Anda tidak memiliki izin (Unauthorized)' }, { status: 401 });
    }

    const body = await request.json();
    const { id, userName } = body;
    
    if (!id || !userName || typeof userName !== 'string') {
      return NextResponse.json({ success: false, error: 'Data tidak valid' }, { status: 400 });
    }

    const cleanName = userName.trim().slice(0, 50);

    const result = await prisma.screeningRecord.findUnique({ where: { UserID_hash: id } });
    if (result) {
      try {
        await prisma.user.update({
          where: { UserID: result.userId },
          data: { Username: cleanName }
        });
      } catch (e) {
        // User record fallback
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update result:', error);
    return NextResponse.json({ success: false, error: 'Gagal memperbarui data' }, { status: 500 });
  }
}
