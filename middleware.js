import { NextResponse } from 'next/server';

export async function middleware(request) {
  const authToken = request.cookies.get('authToken')?.value;
  const path = request.nextUrl.pathname;

  const protectedRoutes = ['/', '/dashboard', '/manage-users', '/categories', '/products'];
  const publicRoutes = ['/login'];

  if (protectedRoutes.includes(path)) {
    if (!authToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (authToken && publicRoutes.includes(path)) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
};