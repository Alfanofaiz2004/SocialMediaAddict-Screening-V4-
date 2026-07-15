import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (username === 'admin' && password === '10123406') {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Username atau password salah' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Kesalahan server' }, { status: 500 });
  }
}
