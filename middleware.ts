import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = request.nextUrl.pathname

  // Define paths that require authentication
  const protectedPaths = [
    '/home',
    '/discover',
    '/feed',
    '/gaming',
    '/marketplace',
    '/near-me',
    '/rovies',
    '/stream',
    '/tickets',
    '/create',
    '/events',
    '/success',
    '/protected',
    '/user-dashboard',
    '/organiser-dashboard',
    '/admin-dashboard',
    '/profile',
    '/messages',
    '/dao'
  ]

  // Define public paths (no authentication required)
  const publicPaths = [
    '/',
    '/auth',
    '/forbidden',
    '/help',
    '/legal',
    '/maintenance',
    '/privacy',
    '/terms'
  ]

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(protectedPath => 
    path.startsWith(protectedPath)
  )

  // Check if the path is public
  const isPublicPath = publicPaths.some(publicPath => 
    path === publicPath || path.startsWith(publicPath + '/')
  ) || path.startsWith('/api/')

  // If it's a protected path, check for authentication
  if (isProtectedPath) {
    // Check for Supabase auth cookies with various possible naming patterns
    const cookies = request.cookies.getAll();
    console.log('🔒 MIDDLEWARE: Checking cookies for path:', path);
    
    // Look for our specific auth cookie or any Supabase authentication cookies
    const hasAuthCookie = cookies.some(cookie => {
      const isAuthCookie = (
        cookie.name === 'sb-auth-token' ||  // Our specific cookie
        cookie.name.startsWith('sb-') || 
        cookie.name.includes('supabase') ||
        cookie.name.includes('auth-token') ||
        cookie.name.includes('access_token') ||
        cookie.name.includes('refresh_token')
      );
      
      if (isAuthCookie && cookie.value && cookie.value.length > 0) {
        console.log('🔒 MIDDLEWARE: Found valid auth cookie:', cookie.name);
        return true;
      }
      
      return false;
    });
    
    if (!hasAuthCookie) {
      console.log('🔒 MIDDLEWARE: No valid auth cookies found, redirecting to login');
      console.log('🔒 MIDDLEWARE: Available cookies:', cookies.map(c => c.name));
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    
    console.log('🔒 MIDDLEWARE: Valid auth cookies found, allowing access');
  }

  // Handle API routes
  if (path.startsWith('/api/')) {
    // Add CORS headers for API routes
    const response = NextResponse.next()
    
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}