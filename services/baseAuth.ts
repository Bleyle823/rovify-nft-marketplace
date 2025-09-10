import { ethers } from 'ethers';

// Define error types to replace 'any'
interface EthereumRpcError extends Error {
    code: number;
    data?: unknown;
}

// Constants
const BASE_MAINNET_CHAIN_ID = '0x2105'; // hex for 8453
const BASE_TESTNET_CHAIN_ID = '0x14a33'; // hex for 84531

export const BASE_NETWORK_INFO = {
    mainnet: {
        chainId: BASE_MAINNET_CHAIN_ID,
        chainName: 'Base Mainnet',
        nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18
        },
        rpcUrls: ['https://mainnet.base.org'],
        blockExplorerUrls: ['https://basescan.org']
    },
    testnet: {
        chainId: BASE_TESTNET_CHAIN_ID,
        chainName: 'Base Goerli Testnet',
        nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18
        },
        rpcUrls: ['https://goerli.base.org'],
        blockExplorerUrls: ['https://goerli.basescan.org']
    }
};

// Generate a random challenge string
export const generateChallenge = (): string => {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Check if Base chain is available in the wallet
export const isBaseChainAvailable = async (): Promise<boolean> => {
    if (!window.ethereum) return false;

    try {
        // Get the current chain ID
        const chainId = await window.ethereum.request({
            method: 'eth_chainId'
        }) as string;

        // Check if already on Base
        if (chainId === BASE_MAINNET_CHAIN_ID || chainId === BASE_TESTNET_CHAIN_ID) {
            return true;
        }

        // With some wallets, we may not be able to check all available chains
        // So we'll just return false and let the user try to switch
        return false;
    } catch (error) {
        console.warn('Error checking for Base chain:', error);
        return false;
    }
};

// Switch to Base chain with improved error handling
export const switchToBaseChain = async (testnet = false): Promise<boolean> => {
    if (!window.ethereum) return false;

    const networkInfo = testnet ? BASE_NETWORK_INFO.testnet : BASE_NETWORK_INFO.mainnet;
    const targetChainId = networkInfo.chainId;

    try {
        console.log('Attempting to switch to Base chain:', networkInfo.chainName);

        // Try to switch to the Base chain
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: targetChainId }]
        });

        console.log('Successfully switched to Base chain');
        return true;
    } catch (switchErrorUnknown: unknown) {
        const switchError = switchErrorUnknown as EthereumRpcError;
        console.log('Chain switch error:', switchError);
        console.log('Error code:', switchError.code);

        // Chain doesn't exist in wallet, add it
        if (switchError.code === 4902) {
            try {
                console.log('Chain not found. Adding Base network to wallet...');

                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: targetChainId,
                        chainName: networkInfo.chainName,
                        nativeCurrency: networkInfo.nativeCurrency,
                        rpcUrls: networkInfo.rpcUrls,
                        blockExplorerUrls: networkInfo.blockExplorerUrls
                    }]
                });

                console.log('Base network added successfully');

                // After adding, try to switch again
                try {
                    console.log('Attempting to switch to Base chain after adding...');
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: targetChainId }]
                    });

                    console.log('Successfully switched to Base chain after adding');
                    return true;
                } catch (secondSwitchErrorUnknown: unknown) {
                    const secondSwitchError = secondSwitchErrorUnknown as EthereumRpcError;
                    console.error('Error switching to Base chain after adding:', secondSwitchError);

                    if (secondSwitchError.code === -32002) {
                        console.warn('MetaMask is already processing a request. Check your wallet.');
                        alert('Please check your wallet to approve the network switch request');
                    } else if (secondSwitchError.code === 4001) {
                        console.warn('User rejected the request to switch networks');
                        alert('You need to approve the network switch to continue');
                    }

                    return false;
                }
            } catch (addErrorUnknown: unknown) {
                const addError = addErrorUnknown as EthereumRpcError;
                console.error('Error adding Base chain to wallet:', addError);

                if (addError.code === 4001) {
                    console.warn('User rejected the request to add the network');
                    alert('You need to approve adding the Base network to continue');
                }

                return false;
            }
        } else if (switchError.code === -32002) {
            // Already processing a request to switch or add network
            console.warn('MetaMask is already processing a network switch request');
            alert('Please check your wallet to approve the network switch request');
            return false;
        } else if (switchError.code === 4001) {
            // User rejected the request
            console.warn('User rejected the request to switch networks');
            alert('You need to approve the network switch to continue');
            return false;
        } else {
            console.error('Unexpected error switching to Base chain:', switchError);
            alert('Could not switch to Base network. Please try manually switching in your wallet.');
            return false;
        }
    }
};

// Connect to Base wallet and get address
export const connectBaseWallet = async (): Promise<string | null> => {
    if (!window.ethereum) {
        throw new Error('No Ethereum wallet detected. Please install Coinbase Wallet or another compatible wallet.');
    }

    try {
        console.log('Requesting wallet connection...');

        // Request accounts
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        }) as string[];

        if (!accounts || accounts.length === 0) {
            throw new Error('No accounts found. Please unlock your wallet.');
        }

        console.log('Connected to wallet with address:', accounts[0]);
        return accounts[0];
    } catch (errorUnknown: unknown) {
        const error = errorUnknown as EthereumRpcError;
        console.error('Error connecting to wallet:', error);

        // Handle specific errors
        if (error.code === 4001) {
            throw new Error('Wallet connection rejected. Please try again and approve the connection request.');
        }

        throw error;
    }
};

// Sign a message with Base wallet
export const signMessageWithBase = async (message: string, address: string): Promise<string> => {
    if (!window.ethereum) {
        throw new Error('No Ethereum wallet detected.');
    }

    try {
        console.log('Requesting message signature for authentication...');

        const signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [message, address]
        }) as string;

        console.log('Message signed successfully');
        return signature;
    } catch (errorUnknown: unknown) {
        const error = errorUnknown as EthereumRpcError;
        console.error('Error signing message:', error);

        // Handle specific errors
        if (error.code === 4001) {
            throw new Error('Signature request rejected. You need to sign the message to authenticate.');
        }

        throw error;
    }
};

// Verify a signature (server-side function, included for completeness)
export const verifySignature = (message: string, signature: string, address: string): boolean => {
    try {
        const recoveredAddress = ethers.verifyMessage(message, signature);
        return recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
        console.error('Error verifying signature:', error);
        return false;
    }
};

// Resolve Base name for an address
export const resolveBaseName = async (address: string): Promise<string | null> => {
    try {
        console.log('Attempting to resolve Base name for address:', address);

        // Connect to Base RPC
        const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');

        // Try to resolve a name (this assumes ENS-compatible resolution on Base)
        const name = await provider.lookupAddress(address);

        if (name) {
            console.log('Resolved Base name:', name);
        } else {
            console.log('No Base name found for address');
        }

        return name;
    } catch (error) {
        console.warn('Error resolving Base name:', error);
        return null;
    }
};

// Check current network and provide helpful information
export const getNetworkInfo = async (): Promise<{
    onBase: boolean;
    currentChain: string | null;
    currentChainName: string | null;
}> => {
    if (!window.ethereum) {
        return { onBase: false, currentChain: null, currentChainName: null };
    }

    try {
        const chainId = await window.ethereum.request({
            method: 'eth_chainId'
        }) as string;

        let chainName = 'Unknown Network';

        // Known networks
        const networks: Record<string, string> = {
            '0x1': 'Ethereum Mainnet',
            '0x5': 'Ethereum Goerli',
            '0x89': 'Polygon Mainnet',
            '0x13881': 'Polygon Mumbai',
            [BASE_MAINNET_CHAIN_ID]: 'Base Mainnet',
            [BASE_TESTNET_CHAIN_ID]: 'Base Testnet',
        };

        if (networks[chainId]) {
            chainName = networks[chainId];
        }

        const onBase = chainId === BASE_MAINNET_CHAIN_ID || chainId === BASE_TESTNET_CHAIN_ID;

        return {
            onBase,
            currentChain: chainId,
            currentChainName: chainName
        };
    } catch (error) {
        console.error('Error getting network info:', error);
        return { onBase: false, currentChain: null, currentChainName: null };
    }
};