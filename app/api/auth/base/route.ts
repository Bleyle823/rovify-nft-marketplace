import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

export async function POST(request: Request) {
    try {
        const { address, signature, message, baseName } = await request.json();

        // Verify inputs
        if (!address || !signature || !message) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Verify the signature
        const recoveredAddress = ethers.verifyMessage(message, signature);

        if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
            return NextResponse.json(
                { message: 'Invalid signature' },
                { status: 401 }
            );
        }

        // Prod, we'll:
        // 1. Check if user exists in your database
        // 2. Create new user if they don't exist
        // 3. Create session/JWT

        // For demo, create user object
        const user = {
            id: `base-${address.slice(2, 10)}`,
            walletAddress: address,
            baseName: baseName || null,
            authMethod: 'base',
            createdAt: new Date().toISOString(),
        };

        // Return the user data
        return NextResponse.json(user);
    } catch (error) {
        console.error('Base authentication error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Authentication failed' },
            { status: 500 }
        );
    }
}