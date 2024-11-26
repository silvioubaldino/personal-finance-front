import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('user_token')?.value;
    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/categories/:path*',
        '/estimates/:path*',
        '/wallets/:path*',
    ],
};