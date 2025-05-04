
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Paths that don't require authentication
  const publicPaths = ['/', '/login', '/register'];
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'));
  
  // Get the user token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  // Redirect logic
  if (isPublicPath && token) {
    // If user is authenticated and tries to access public path, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  if (!isPublicPath && !token) {
    // If user is not authenticated and tries to access private path, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If none of the above, continue
  return NextResponse.next();
}

// Specify the paths the middleware should run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
