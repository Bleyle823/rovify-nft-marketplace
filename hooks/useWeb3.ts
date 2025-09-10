/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider, JsonRpcSigner } from 'ethers';

// Define the window ethereum extension for TypeScript
declare global {
    interface Window {
        ethereum?: any;
    }
}

interface Web3State {
    provider: BrowserProvider | null;
    signer: JsonRpcSigner | null;
    address: string | null;
    chainId: number | null;
    isConnected: boolean;
    isConnecting: boolean;
    error: string | null;
}

const initialState: Web3State = {
    provider: null,
    signer: null,
    address: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
    error: null,
};

export function useWeb3() {
    const [state, setState] = useState<Web3State>(initialState);

    // Check if wallet was previously connected
    useEffect(() => {
        const checkPreviousConnection = async () => {
            try {
                const savedAddress = localStorage.getItem('walletAddress');

                if (savedAddress && window.ethereum) {
                    const provider = new BrowserProvider(window.ethereum);
                    const accounts = await provider.listAccounts();

                    if (accounts.length > 0 && accounts[0].address.toLowerCase() === savedAddress.toLowerCase()) {
                        const signer = await provider.getSigner();
                        const network = await provider.getNetwork();

                        setState({
                            provider,
                            signer,
                            address: accounts[0].address,
                            chainId: Number(network.chainId),
                            isConnected: true,
                            isConnecting: false,
                            error: null,
                        });
                    } else {
                        // Saved address doesn't match current account
                        localStorage.removeItem('walletAddress');
                    }
                }
            } catch (error) {
                console.error('Error checking previous wallet connection:', error);
            }
        };

        checkPreviousConnection();
    }, []);

    // Disconnect wallet function
    const disconnect = useCallback(() => {
        setState(initialState);
        localStorage.removeItem('walletAddress');
    }, []);

    // Listen for account and chain changes
    useEffect(() => {
        if (!window.ethereum) return;

        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length === 0) {
                // User disconnected wallet
                disconnect();
            } else if (accounts[0] !== state.address) {
                // Account changed
                updateState(accounts[0]);
            }
        };

        const handleChainChanged = () => {
            // Chain changed, reload the page as recommended by MetaMask
            window.location.reload();
        };

        const updateState = async (newAddress: string) => {
            try {
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const network = await provider.getNetwork();

                setState({
                    provider,
                    signer,
                    address: newAddress,
                    chainId: Number(network.chainId),
                    isConnected: true,
                    isConnecting: false,
                    error: null,
                });

                localStorage.setItem('walletAddress', newAddress);
            } catch (error) {
                console.error('Error updating wallet state:', error);
            }
        };

        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);

        return () => {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum.removeListener('chainChanged', handleChainChanged);
        };
    }, [state.address, disconnect]);

    // Connect to wallet
    const connect = useCallback(async () => {
        if (!window.ethereum) {
            setState(prev => ({
                ...prev,
                error: 'No crypto wallet found. Please install MetaMask or another Web3 wallet.',
            }));
            return false;
        }

        try {
            setState(prev => ({ ...prev, isConnecting: true, error: null }));

            const provider = new BrowserProvider(window.ethereum);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const address = accounts[0];
            const signer = await provider.getSigner();
            const network = await provider.getNetwork();

            setState({
                provider,
                signer,
                address,
                chainId: Number(network.chainId),
                isConnected: true,
                isConnecting: false,
                error: null,
            });

            localStorage.setItem('walletAddress', address);

            return true;
        } catch (error: unknown) {
            console.error('Error connecting to wallet:', error);
            const errorMessage = error instanceof Error ? error.message : 'An error occurred while connecting to your wallet.';

            setState(prev => ({
                ...prev,
                isConnecting: false,
                error: errorMessage,
            }));

            return false;
        }
    }, []);

    // Format address for display
    const formatAddress = useCallback((address: string | null) => {
        if (!address) return '';
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }, []);

    // Switch chain
    const switchChain = useCallback(async (targetChainId: number) => {
        if (!window.ethereum || !state.provider) {
            setState(prev => ({
                ...prev,
                error: 'No crypto wallet found or not connected.',
            }));
            return false;
        }

        try {
            const hexChainId = `0x${targetChainId.toString(16)}`;

            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: hexChainId }],
            });

            return true;
        } catch (error: unknown) {
            console.error('Error switching chain:', error);

            // This error code indicates that the chain has not been added to MetaMask
            if (error instanceof Object && 'code' in error && error.code === 4902) {
                // For Polygon mainnet example
                if (targetChainId === 137) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: '0x89',
                                    chainName: 'Polygon Mainnet',
                                    nativeCurrency: {
                                        name: 'MATIC',
                                        symbol: 'MATIC',
                                        decimals: 18,
                                    },
                                    rpcUrls: ['https://polygon-rpc.com/'],
                                    blockExplorerUrls: ['https://polygonscan.com/'],
                                },
                            ],
                        });
                        return true;
                    } catch (addError) {
                        console.error('Error adding chain:', addError);
                        setState(prev => ({
                            ...prev,
                            error: 'Could not add the network to your wallet.',
                        }));
                        return false;
                    }
                }
            }

            setState(prev => ({
                ...prev,
                error: 'Failed to switch network.',
            }));
            return false;
        }
    }, [state.provider]);

    return {
        ...state,
        connect,
        disconnect,
        formatAddress,
        switchChain,
    };
}