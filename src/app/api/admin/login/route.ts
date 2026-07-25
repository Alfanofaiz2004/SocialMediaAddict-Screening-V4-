import { NextResponse } from 'next/server';
import { validateAdminCredentials, generateAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Username dan password wajib diisi' }, { status: 400 });
    }

    if (validateAdminCredentials(username, password)) {
      const token = generateAdminToken();
      const response = NextResponse.json({ success: true, token });

      // Set secure HTTP-Only cookie for server session verification
      response.cookies.set({
        name: ADMIN_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return response;
    }

    return NextResponse.json({ success: false, error: 'Username atau password salah' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
