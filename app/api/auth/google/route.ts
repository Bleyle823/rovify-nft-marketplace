// app/api/auth/google/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Types for Google OAuth responses
interface TokenResponse {
    access_token: string;
    id_token: string;
    expires_in: number;
    token_type: string;
    refresh_token?: string;
    scope: string;
}

interface GoogleUserInfo {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
}

export async function POST(request: NextRequest) {
    try {
        // Parse the request body
        const body = await request.json();
        const { code, codeVerifier, redirectUri } = body;

        // Validate required parameters
        if (!code || !codeVerifier || !redirectUri) {
            return NextResponse.json(
                { message: 'Missing required parameters' },
                { status: 400 }
            );
        }

        console.log('Processing token exchange with redirect URI:', redirectUri);

        // Get environment variables
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            console.error('Google OAuth credentials not configured');
            return NextResponse.json(
                { message: 'OAuth configuration error' },
                { status: 500 }
            );
        }

        console.log('Exchanging authorization code for tokens...');

        // Exchange the authorization code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                code,
                code_verifier: codeVerifier,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri
            }),
        });

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json();
            console.error('Token exchange failed:', errorData);
            return NextResponse.json(
                { message: 'Failed to exchange code for tokens' },
                { status: 400 }
            );
        }

        // Parse the token response
        const tokens: TokenResponse = await tokenResponse.json();
        console.log('Tokens received, access token expires in', tokens.expires_in, 'seconds');

        // Get user info with the access token
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`
            }
        });

        if (!userInfoResponse.ok) {
            const errorData = await userInfoResponse.json();
            console.error('User info retrieval failed:', errorData);
            return NextResponse.json(
                { message: 'Failed to retrieve user profile' },
                { status: 400 }
            );
        }

        // Parse the user info
        const googleUser: GoogleUserInfo = await userInfoResponse.json();
        console.log('Google user profile retrieved:', googleUser.email);

        // In a real application, you would:
        // 1. Check if the user exists in your database
        // 2. Create the user if they don't exist
        // 3. Generate a session or JWT token

        // For this example, we'll just return the user data
        return NextResponse.json({
            id: `google-${googleUser.id}`,
            email: googleUser.email,
            name: googleUser.name,
            profilePicture: googleUser.picture,
            authMethod: 'google',
            expiresAt: Date.now() + tokens.expires_in * 1000
        });

    } catch (error) {
        console.error('Google OAuth error:', error);
        return NextResponse.json(
            { message: 'Authentication failed' },
            { status: 500 }
        );
    }
}