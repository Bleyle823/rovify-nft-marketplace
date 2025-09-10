import { NextRequest, NextResponse } from 'next/server';
import { getBaseUrl } from '@/utils/env';

export async function GET(request: NextRequest) {
    try {
        // Extract code and state parameters from the URL
        const code = request.nextUrl.searchParams.get('code');
        const state = request.nextUrl.searchParams.get('state');

        console.log('Google OAuth callback received with state:', state?.substring(0, 8) + '...');

        if (!code || !state) {
            console.error('Missing required OAuth parameters');
            return NextResponse.redirect(
                new URL('/auth/login?error=Missing+required+parameters', getBaseUrl())
            );
        }

        // Redirect to the client-side callback handler using correct base URL
        const callbackUrl = new URL('/auth/callback', getBaseUrl());
        callbackUrl.searchParams.set('code', code);
        callbackUrl.searchParams.set('state', state);

        console.log('Redirecting to client-side callback handler:', callbackUrl.toString());
        return NextResponse.redirect(callbackUrl);
    } catch (error) {
        console.error('Error handling Google callback:', error);
        return NextResponse.redirect(
            new URL('/auth/login?error=Authentication+failed', getBaseUrl())
        );
    }
}