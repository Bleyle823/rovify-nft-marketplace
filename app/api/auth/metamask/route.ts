// app/api/auth/metamask/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

interface RequestBody {
    walletAddress: string;
    signature: string;
    message: string;
}

/**
 * Verify an Ethereum signature
 */
function verifyEthereumSignature(message: string, signature: string, address: string): boolean {
    try {
        // Recover the address from the signature
        const recoveredAddress = ethers.verifyMessage(message, signature);

        // Check if the recovered address matches the provided address
        return recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
        console.error('Signature verification error:', error);
        return false;
    }
}

export async function POST(request: NextRequest) {
    try {
        // Parse the request body
        const body = await request.json() as RequestBody;
        const { walletAddress, signature, message } = body;

        // Validate required parameters
        if (!walletAddress || !signature || !message) {
            return NextResponse.json(
                { message: 'Missing required parameters' },
                { status: 400 }
            );
        }

        console.log('Verifying signature for wallet:', walletAddress);

        // Verify the signature
        const isValid = verifyEthereumSignature(message, signature, walletAddress);

        if (!isValid) {
            console.error('Invalid signature');
            return NextResponse.json(
                { message: 'Invalid signature' },
                { status: 401 }
            );
        }

        console.log('Signature verified successfully');

        // In a real application, you would:
        // 1. Check if the wallet exists in your database
        // 2. Create a user record if it doesn't exist
        // 3. Generate a session or JWT token

        // For this example, we'll just return the user data
        return NextResponse.json({
            id: `wallet-${walletAddress.substring(2, 10)}`,
            walletAddress,
            authMethod: 'metamask',
            expiresAt: Date.now() + 3600000 // 1 hour
        });

    } catch (error) {
        console.error('MetaMask authentication error:', error);
        return NextResponse.json(
            { message: 'Authentication failed' },
            { status: 500 }
        );
    }
}