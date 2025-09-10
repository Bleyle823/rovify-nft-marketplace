/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: Event;
    ticketType: string;
    quantity: number;
    price: number;
}

export default function PurchaseModal({
    isOpen,
    onClose,
    event,
    ticketType,
    quantity,
    price
}: PurchaseModalProps) {
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        cardNumber: '',
        expiry: '',
        cvc: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Calculate fees and total
    const serviceFee = quantity * 2.5;
    const tax = price * 0.1; // 10% tax
    const discount = quantity >= 5 ? price * 0.1 : 0; // 10% discount
    const total = price + serviceFee + tax - discount;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';

        if (paymentMethod === 'card') {
            if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
                newErrors.cardNumber = 'Valid card number is required';
            }
            if (!formData.expiry.match(/^\d{2}\/\d{2}$/)) {
                newErrors.expiry = 'Valid expiry date (MM/YY) is required';
            }
            if (!formData.cvc.match(/^\d{3,4}$/)) {
                newErrors.cvc = 'Valid CVC is required';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsProcessing(true);

        try {
            // Simulated payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Success handling
            onClose();
            // Show success message
        } catch (error) {
            // Error handling
            setErrors({ submit: 'Payment failed. Please try again.' });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleConnectWallet = async () => {
        // Metamask integration logic
        try {
            // @ts-ignore - Metamask window.ethereum
            if (window.ethereum) {
                setIsProcessing(true);
                // @ts-ignore
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                // Continue with crypto payment if accounts are available
            } else {
                setErrors({ submit: 'Metamask not detected. Please install Metamask.' });
            }
        } catch (error) {
            setErrors({ submit: 'Failed to connect wallet. Please try again.' });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-xl shadow-xl w-full max-w-md m-4 max-h-[90vh] overflow-y-auto"
                    >
                        <div className="relative">
                            {/* Modal header */}
                            <div className="sticky top-0 z-10 bg-white rounded-t-xl border-b border-gray-200 p-5">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-gray-900">Complete Your Purchase</h2>
                                    <button
                                        onClick={onClose}
                                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all bg-gray-100 hover:bg-gray-200 text-gray-500"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Modal body */}
                            <div className="p-5">
                                {/* Order summary */}
                                <div className="mb-6 bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">Order Summary</h3>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600">
                                            {ticketType === 'vip' ? 'VIP' : 'General'} Ticket × {quantity}
                                        </span>
                                        <span className="font-medium">${price.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600">Service Fee</span>
                                        <span className="font-medium">${serviceFee.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="font-medium">${tax.toFixed(2)}</span>
                                    </div>

                                    {discount > 0 && (
                                        <div className="flex justify-between items-center mb-2 text-green-600">
                                            <span>Group Discount (10%)</span>
                                            <span className="font-medium">-${discount.toFixed(2)}</span>
                                        </div>
                                    )}

                                    <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
                                        <span className="font-semibold text-gray-900">Total</span>
                                        <span className="font-bold text-[#FF5722]">${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Payment method selector */}
                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('card')}
                                            className={`flex items-center justify-center p-3 rounded-lg border transition-all ${paymentMethod === 'card'
                                                ? 'border-[#FF5722] bg-[#FF5722]/5 shadow-sm'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <svg className="w-5 h-5 mr-2 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                                            </svg>
                                            <span>Credit Card</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('crypto')}
                                            className={`flex items-center justify-center p-3 rounded-lg border transition-all ${paymentMethod === 'crypto'
                                                ? 'border-[#FF5722] bg-[#FF5722]/5 shadow-sm'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <svg className="w-5 h-5 mr-2 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                                                {/* SVG for crypto icon */}
                                                <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"></path>
                                            </svg>
                                            <span>Crypto</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Payment form - Credit Card */}
                                {paymentMethod === 'card' && (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Full Name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'
                                                    } focus:outline-none focus:ring-2 focus:ring-[#FF5722]/50`}
                                            />
                                            {errors.name && (
                                                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="email@example.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                                    } focus:outline-none focus:ring-2 focus:ring-[#FF5722]/50`}
                                            />
                                            {errors.email && (
                                                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                            <input
                                                type="text"
                                                name="cardNumber"
                                                placeholder="1234 5678 9012 3456"
                                                value={formData.cardNumber}
                                                onChange={handleChange}
                                                maxLength={19}
                                                className={`w-full px-4 py-3 rounded-lg border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                                                    } focus:outline-none focus:ring-2 focus:ring-[#FF5722]/50`}
                                            />
                                            {errors.cardNumber && (
                                                <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                                <input
                                                    type="text"
                                                    name="expiry"
                                                    placeholder="MM/YY"
                                                    value={formData.expiry}
                                                    onChange={handleChange}
                                                    maxLength={5}
                                                    className={`w-full px-4 py-3 rounded-lg border ${errors.expiry ? 'border-red-500' : 'border-gray-300'
                                                        } focus:outline-none focus:ring-2 focus:ring-[#FF5722]/50`}
                                                />
                                                {errors.expiry && (
                                                    <p className="mt-1 text-sm text-red-500">{errors.expiry}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                                                <input
                                                    type="text"
                                                    name="cvc"
                                                    placeholder="123"
                                                    value={formData.cvc}
                                                    onChange={handleChange}
                                                    maxLength={4}
                                                    className={`w-full px-4 py-3 rounded-lg border ${errors.cvc ? 'border-red-500' : 'border-gray-300'
                                                        } focus:outline-none focus:ring-2 focus:ring-[#FF5722]/50`}
                                                />
                                                {errors.cvc && (
                                                    <p className="mt-1 text-sm text-red-500">{errors.cvc}</p>
                                                )}
                                            </div>
                                        </div>

                                        {errors.submit && (
                                            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
                                                {errors.submit}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isProcessing}
                                            className="w-full py-3 px-6 rounded-full font-medium text-white bg-gradient-to-r from-[#FF5722] to-[#FF7A50] hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isProcessing ? (
                                                <span className="flex items-center justify-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </span>
                                            ) : (
                                                `Complete Purchase - $${total.toFixed(2)}`
                                            )}
                                        </button>
                                    </form>
                                )}

                                {/* Crypto Payment */}
                                {paymentMethod === 'crypto' && (
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                                            <p className="text-gray-700 mb-4">
                                                Connect your Web3 wallet to pay with cryptocurrency.
                                            </p>

                                            <button
                                                onClick={handleConnectWallet}
                                                disabled={isProcessing}
                                                className="py-3 px-6 rounded-full font-medium text-white bg-[#FF5722] hover:bg-[#E64A19] transition-colors disabled:opacity-70 flex items-center justify-center w-full"
                                            >
                                                {isProcessing ? (
                                                    <span className="flex items-center">
                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Connecting...
                                                    </span>
                                                ) : (
                                                    <>
                                                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                                            {/* Metamask icon SVG */}
                                                            <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"></path>
                                                        </svg>
                                                        Connect Wallet
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {errors.submit && (
                                            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
                                                {errors.submit}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}