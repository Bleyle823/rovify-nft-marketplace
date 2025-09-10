/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    FiPlus, FiEdit3, FiTrash2, FiCopy, FiEye, FiSettings,
    FiCalendar, FiClock, FiUsers, FiDollarSign, FiPercent,
    FiTarget, FiBarChart, FiTrendingUp, FiTrendingDown,
    FiFilter, FiSearch, FiDownload, FiRefreshCw, FiMoreHorizontal,
    FiCheckCircle, FiXCircle, FiAlertCircle, FiStar, FiZap,
    FiX, FiCheck, FiUpload, FiImage, FiTag, FiCreditCard
} from 'react-icons/fi';
import { IoSparkles, IoTicket, IoTrendingUp, IoFlash } from "react-icons/io5";
import { HiOutlineSparkles, HiOutlineTicket, HiOutlineFire } from "react-icons/hi2";
import { BsTicketPerforated, BsLightningCharge } from "react-icons/bs";

// TypeScript interfaces
interface TicketType {
    id: string;
    name: string;
    eventTitle: string;
    eventId: string;
    eventImage: string;
    price: number;
    originalPrice: number;
    quantity: number;
    sold: number;
    available: number;
    status: 'active' | 'paused' | 'sold_out' | 'draft';
    saleStart: string;
    saleEnd: string;
    description: string;
    features: string[];
    salesVelocity: number;
    revenue: number;
    conversionRate: number;
    category: 'premium' | 'standard' | 'discount' | 'early_bird';
}

interface FormData {
    name: string;
    eventTitle: string;
    price: string;
    originalPrice: string;
    quantity: string;
    description: string;
    features: string[];
    category: 'premium' | 'standard' | 'discount' | 'early_bird';
    saleStart: string;
    saleEnd: string;
}

interface FormErrors {
    [key: string]: string;
}

interface ProfessionalModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

interface ProfessionalInputProps {
    label: string;
    icon?: React.ReactNode;
    type?: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    className?: string;
}

interface ProfessionalButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    className?: string;
}

interface TicketFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticket?: TicketType | null;
    onSave: (ticketData: TicketType) => void;
}

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticket: TicketType | null;
    onConfirm: (ticketId: string) => void;
}

interface TicketCardProps {
    ticket: TicketType;
    index: number;
    viewMode: 'grid' | 'list';
    onEdit: (ticket: TicketType) => void;
    onDelete: (ticket: TicketType) => void;
    onDuplicate: (ticket: TicketType) => void;
    onToggleStatus: (ticket: TicketType) => void;
}

// Mock data
const mockTicketTypes: TicketType[] = [
    {
        id: 'ticket1',
        name: 'VIP Experience',
        eventTitle: 'AI & Machine Learning Summit 2025',
        eventId: 'event1',
        eventImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
        price: 299,
        originalPrice: 349,
        quantity: 100,
        sold: 87,
        available: 13,
        status: 'active',
        saleStart: '2025-05-01',
        saleEnd: '2025-07-14',
        description: 'Premium access with VIP lounge, priority seating, and exclusive networking session',
        features: ['VIP Lounge Access', 'Priority Seating', 'Welcome Drink', 'Networking Session', 'Certificate'],
        salesVelocity: 8.7,
        revenue: 25963,
        conversionRate: 12.4,
        category: 'premium'
    },
    {
        id: 'ticket2',
        name: 'General Admission',
        eventTitle: 'AI & Machine Learning Summit 2025',
        eventId: 'event1',
        eventImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
        price: 199,
        originalPrice: 199,
        quantity: 700,
        sold: 543,
        available: 157,
        status: 'active',
        saleStart: '2025-05-01',
        saleEnd: '2025-07-14',
        description: 'Standard access to all main sessions and exhibition area',
        features: ['Main Sessions', 'Exhibition Access', 'Lunch Included', 'Digital Resources'],
        salesVelocity: 15.2,
        revenue: 108057,
        conversionRate: 9.8,
        category: 'standard'
    },
    {
        id: 'ticket3',
        name: 'Student Discount',
        eventTitle: 'AI & Machine Learning Summit 2025',
        eventId: 'event1',
        eventImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
        price: 99,
        originalPrice: 199,
        quantity: 100,
        sold: 78,
        available: 22,
        status: 'active',
        saleStart: '2025-05-01',
        saleEnd: '2025-07-14',
        description: 'Special pricing for students with valid ID',
        features: ['Main Sessions', 'Student Networking', 'Digital Resources', 'Career Fair Access'],
        salesVelocity: 12.1,
        revenue: 7722,
        conversionRate: 18.6,
        category: 'discount'
    }
];

const ticketStatusConfig = {
    active: {
        label: 'Active',
        color: 'bg-emerald-100 text-emerald-700',
        icon: <FiCheckCircle className="w-3 h-3" />,
        dot: 'bg-emerald-500'
    },
    paused: {
        label: 'Paused',
        color: 'bg-yellow-100 text-yellow-700',
        icon: <FiAlertCircle className="w-3 h-3" />,
        dot: 'bg-yellow-500'
    },
    sold_out: {
        label: 'Sold Out',
        color: 'bg-red-100 text-red-700',
        icon: <FiXCircle className="w-3 h-3" />,
        dot: 'bg-red-500'
    },
    draft: {
        label: 'Draft',
        color: 'bg-gray-100 text-gray-700',
        icon: <FiEdit3 className="w-3 h-3" />,
        dot: 'bg-gray-500'
    }
} as const;

const ticketCategoryConfig = {
    premium: { label: 'Premium', color: 'from-purple-500 to-purple-600', icon: '👑' },
    standard: { label: 'Standard', color: 'from-blue-500 to-blue-600', icon: '🎫' },
    discount: { label: 'Discount', color: 'from-emerald-500 to-emerald-600', icon: '🎓' },
    early_bird: { label: 'Early Bird', color: 'from-orange-500 to-orange-600', icon: '🐦' }
} as const;

// Professional Modal Component
const ProfessionalModal: React.FC<ProfessionalModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className={`relative w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl border border-gray-100`}
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-orange-50">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                                <motion.button
                                    onClick={onClose}
                                    className="p-2 rounded-xl hover:bg-white hover:shadow-lg transition-all text-gray-500 hover:text-gray-700"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiX className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="max-h-[70vh] overflow-y-auto">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Professional Input Component
const ProfessionalInput: React.FC<ProfessionalInputProps> = ({
    label,
    icon,
    type = 'text',
    placeholder,
    value,
    onChange,
    required = false,
    className = ""
}) => {
    return (
        <div className={className}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 transition-all outline-none`}
                    required={required}
                />
            </div>
        </div>
    );
};

// Professional Button Component
const ProfessionalButton: React.FC<ProfessionalButtonProps> = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    disabled = false,
    className = ""
}) => {
    const variants = {
        primary: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg',
        secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:shadow-lg',
        danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg'
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3',
        lg: 'px-8 py-4 text-lg'
    };

    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            className={`${variants[variant]} ${sizes[size]} rounded-xl font-semibold transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
        >
            {children}
        </motion.button>
    );
};

// Create/Edit Ticket Modal
const TicketFormModal: React.FC<TicketFormModalProps> = ({ isOpen, onClose, ticket = null, onSave }) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        eventTitle: 'AI & Machine Learning Summit 2025',
        price: '',
        originalPrice: '',
        quantity: '',
        description: '',
        features: [''],
        category: 'standard',
        saleStart: '',
        saleEnd: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (ticket) {
            setFormData({
                name: ticket.name,
                eventTitle: ticket.eventTitle,
                price: ticket.price.toString(),
                originalPrice: ticket.originalPrice.toString(),
                quantity: ticket.quantity.toString(),
                description: ticket.description,
                features: ticket.features,
                category: ticket.category,
                saleStart: ticket.saleStart,
                saleEnd: ticket.saleEnd
            });
        } else {
            setFormData({
                name: '',
                eventTitle: 'AI & Machine Learning Summit 2025',
                price: '',
                originalPrice: '',
                quantity: '',
                description: '',
                features: [''],
                category: 'standard',
                saleStart: '',
                saleEnd: ''
            });
        }
        setErrors({});
    }, [ticket, isOpen]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Ticket name is required';
        if (!formData.price) newErrors.price = 'Price is required';
        if (!formData.quantity) newErrors.quantity = 'Quantity is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.saleStart) newErrors.saleStart = 'Sale start date is required';
        if (!formData.saleEnd) newErrors.saleEnd = 'Sale end date is required';

        if (formData.saleStart && formData.saleEnd && new Date(formData.saleStart) >= new Date(formData.saleEnd)) {
            newErrors.saleEnd = 'Sale end date must be after start date';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (): void => {
        if (validateForm()) {
            const ticketData: TicketType = {
                ...formData,
                price: parseFloat(formData.price),
                originalPrice: parseFloat(formData.originalPrice || formData.price),
                quantity: parseInt(formData.quantity),
                features: formData.features.filter(f => f.trim()),
                id: ticket?.id || `ticket${Date.now()}`,
                eventId: 'event1',
                eventImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
                sold: ticket?.sold || 0,
                available: parseInt(formData.quantity) - (ticket?.sold || 0),
                status: ticket?.status || 'draft',
                salesVelocity: ticket?.salesVelocity || 0,
                revenue: ticket?.revenue || 0,
                conversionRate: ticket?.conversionRate || 0
            };

            onSave(ticketData);
            onClose();
        }
    };

    const updateFormData = (key: keyof FormData, value: string | string[]): void => {
        setFormData(prev => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors(prev => ({ ...prev, [key]: '' }));
        }
    };

    const addFeature = (): void => {
        setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
    };

    const updateFeature = (index: number, value: string): void => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const removeFeature = (index: number): void => {
        const newFeatures = formData.features.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    return (
        <ProfessionalModal
            isOpen={isOpen}
            onClose={onClose}
            title={ticket ? 'Edit Ticket Type' : 'Create New Ticket Type'}
            size="lg"
        >
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <ProfessionalInput
                            label="Ticket Name"
                            icon={<FiTag className="w-5 h-5" />}
                            placeholder="e.g., VIP Experience"
                            value={formData.name}
                            onChange={(e) => updateFormData('name', e.target.value)}
                            required
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => updateFormData('category', e.target.value as FormData['category'])}
                            className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                        >
                            {Object.entries(ticketCategoryConfig).map(([key, config]) => (
                                <option key={key} value={key}>
                                    {config.icon} {config.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <ProfessionalInput
                            label="Price"
                            icon={<FiDollarSign className="w-5 h-5" />}
                            type="number"
                            placeholder="299"
                            value={formData.price}
                            onChange={(e) => updateFormData('price', e.target.value)}
                            required
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                    </div>

                    <ProfessionalInput
                        label="Original Price (Optional)"
                        icon={<FiPercent className="w-5 h-5" />}
                        type="number"
                        placeholder="349"
                        value={formData.originalPrice}
                        onChange={(e) => updateFormData('originalPrice', e.target.value)}
                    />

                    <div>
                        <ProfessionalInput
                            label="Quantity"
                            icon={<FiUsers className="w-5 h-5" />}
                            type="number"
                            placeholder="100"
                            value={formData.quantity}
                            onChange={(e) => updateFormData('quantity', e.target.value)}
                            required
                        />
                        {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Sale Start Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="date"
                                value={formData.saleStart}
                                onChange={(e) => updateFormData('saleStart', e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                                required
                            />
                        </div>
                        {errors.saleStart && <p className="text-red-500 text-sm mt-1">{errors.saleStart}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Sale End Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="date"
                                value={formData.saleEnd}
                                onChange={(e) => updateFormData('saleEnd', e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                                required
                            />
                        </div>
                        {errors.saleEnd && <p className="text-red-500 text-sm mt-1">{errors.saleEnd}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        placeholder="Describe what's included with this ticket..."
                        value={formData.description}
                        onChange={(e) => updateFormData('description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 transition-all outline-none resize-none"
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div>
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-semibold text-gray-700">
                            Features & Benefits
                        </label>
                        <motion.button
                            onClick={addFeature}
                            className="flex items-center gap-2 px-3 py-2 text-sm bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:shadow-lg rounded-xl font-semibold transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FiPlus className="w-4 h-4" />
                            Add Feature
                        </motion.button>
                    </div>
                    <div className="space-y-3">
                        {formData.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <input
                                    type="text"
                                    placeholder="e.g., VIP Lounge Access"
                                    value={feature}
                                    onChange={(e) => updateFeature(index, e.target.value)}
                                    className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                                />
                                {formData.features.length > 1 && (
                                    <motion.button
                                        onClick={() => removeFeature(index)}
                                        className="flex-shrink-0 p-3 bg-red-50 rounded-xl hover:bg-red-100 transition-all text-red-600 border border-red-200"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </motion.button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100 sm:justify-end">
                    <motion.button
                        onClick={onClose}
                        className="w-full sm:w-auto px-5 py-2.5 text-sm bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:shadow-lg rounded-xl font-semibold transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Cancel
                    </motion.button>
                    <motion.button
                        onClick={handleSubmit}
                        className="w-full sm:w-auto px-5 py-2.5 text-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <FiCheck className="w-4 h-4" />
                        {ticket ? 'Update Ticket' : 'Create Ticket'}
                    </motion.button>
                </div>
            </div>
        </ProfessionalModal>
    );
};

// Delete Confirmation Modal
const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, ticket, onConfirm }) => {
    return (
        <ProfessionalModal
            isOpen={isOpen}
            onClose={onClose}
            title="Delete Ticket Type"
            size="sm"
        >
            <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200">
                    <FiTrash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Are you sure you want to delete this ticket type?
                </h3>
                <p className="text-gray-600 mb-6">
                    This will permanently delete &quot;{ticket?.name}&quot; and cannot be undone.
                    {ticket && ticket.sold > 0 && (
                        <span className="block mt-2 text-red-600 font-semibold">
                            Warning: {ticket.sold} tickets have already been sold!
                        </span>
                    )}
                </p>
                <div className="flex gap-4">
                    <ProfessionalButton
                        onClick={onClose}
                        variant="secondary"
                        className="flex-1"
                    >
                        Cancel
                    </ProfessionalButton>
                    <ProfessionalButton
                        onClick={() => {
                            if (ticket) {
                                onConfirm(ticket.id);
                                onClose();
                            }
                        }}
                        variant="danger"
                        className="flex-1"
                    >
                        <FiTrash2 className="w-4 h-4 mr-2" />
                        Delete
                    </ProfessionalButton>
                </div>
            </div>
        </ProfessionalModal>
    );
};

// Ticket Card Component
const TicketCard: React.FC<TicketCardProps> = ({
    ticket,
    index,
    viewMode,
    onEdit,
    onDelete,
    onDuplicate,
    onToggleStatus
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const statusStyle = ticketStatusConfig[ticket.status];
    const categoryConfig = ticketCategoryConfig[ticket.category];
    const soldPercentage = (ticket.sold / ticket.quantity) * 100;
    const isNearSoldOut = soldPercentage >= 90;
    const isLowStock = soldPercentage >= 75 && soldPercentage < 90;

    const menuItems = [
        { icon: <FiEye className="w-4 h-4" />, label: 'View Details', action: () => { } },
        { icon: <FiEdit3 className="w-4 h-4" />, label: 'Edit Ticket', action: () => onEdit(ticket) },
        { icon: <FiCopy className="w-4 h-4" />, label: 'Duplicate', action: () => onDuplicate(ticket) },
        {
            icon: ticket.status === 'active' ? <FiAlertCircle className="w-4 h-4" /> : <FiCheckCircle className="w-4 h-4" />,
            label: ticket.status === 'active' ? 'Pause Sales' : 'Activate',
            action: () => onToggleStatus(ticket)
        },
        { icon: <FiBarChart className="w-4 h-4" />, label: 'Analytics', action: () => { } },
        { icon: <FiTrash2 className="w-4 h-4" />, label: 'Delete', action: () => onDelete(ticket), danger: true }
    ];

    if (viewMode === 'list') {
        return (
            <motion.div
                className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
            >
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                    {/* Image and status */}
                    <div className="relative flex-shrink-0">
                        <Image
                            src={ticket.eventImage}
                            alt={ticket.eventTitle}
                            className="w-full h-full object-cover rounded-xl"
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            style={{ objectFit: 'cover', borderRadius: '0.75rem' }}
                            priority={index < 3}
                        />
                    </div>
                    <div className={`absolute -top-2 -right-2 w-4 h-4 ${statusStyle.dot} rounded-full border-2 border-white`}></div>
                    {isNearSoldOut && (
                        <div className="absolute -bottom-2 -left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                            <HiOutlineFire className="w-3 h-3" />
                            Hot
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                                <h3 className="font-bold text-gray-900 text-lg group-hover:text-orange-600 transition-colors">
                                    {ticket.name}
                                </h3>
                                <span className={`self-start px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${categoryConfig.color}`}>
                                    {categoryConfig.icon} {categoryConfig.label}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{ticket.eventTitle}</p>
                            <p className="text-sm text-gray-500 line-clamp-2">{ticket.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`${statusStyle.color} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
                                {statusStyle.icon}
                                {statusStyle.label}
                            </div>
                        </div>
                    </div>

                    {/* Stats grid - responsive */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
                        <div className="bg-gray-50 rounded-xl p-3">
                            <div className="flex items-center gap-1">
                                <div className="text-lg font-bold text-gray-900">
                                    ${ticket.price}
                                </div>
                                {ticket.originalPrice > ticket.price && (
                                    <div className="text-sm text-gray-500 line-through">
                                        ${ticket.originalPrice}
                                    </div>
                                )}
                            </div>
                            <div className="text-xs text-gray-600">Price</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                            <div className="text-lg font-bold text-gray-900">{ticket.sold}/{ticket.quantity}</div>
                            <div className="text-xs text-gray-600">Sold</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                            <div className="text-lg font-bold text-emerald-600">${ticket.revenue.toLocaleString()}</div>
                            <div className="text-xs text-gray-600">Revenue</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                            <div className="text-lg font-bold text-blue-600">{ticket.conversionRate}%</div>
                            <div className="text-xs text-gray-600">Conversion</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                            <div className="text-lg font-bold text-purple-600">{ticket.salesVelocity}</div>
                            <div className="text-xs text-gray-600">Velocity</div>
                        </div>
                    </div>

                    {/* Progress and actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full rounded-full ${isNearSoldOut ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                                            isLowStock ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                                'bg-gradient-to-r from-emerald-500 to-green-500'
                                            }`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${soldPercentage}%` }}
                                        transition={{ delay: index * 0.2, duration: 1 }}
                                    />
                                </div>
                                <span className="text-xs text-gray-500">{Math.round(soldPercentage)}%</span>
                            </div>

                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                <FiCalendar className="w-4 h-4" />
                                <span>Until {new Date(ticket.saleEnd).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="relative">
                            <motion.button
                                className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiMoreHorizontal className="w-5 h-5 text-gray-500" />
                            </motion.button>

                            <AnimatePresence>
                                {dropdownOpen && (
                                    <motion.div
                                        className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        {menuItems.map((item) => (
                                            <button
                                                key={item.label}
                                                onClick={() => {
                                                    item.action();
                                                    setDropdownOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left ${item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'}`}
                                            >
                                                {item.icon}
                                                {item.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Grid view - also responsive
    return (
        <motion.div
            className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
        >
            <div className="relative mb-4">
                <div className="w-full h-32 sm:h-40 relative">
                    <Image
                        src={ticket.eventImage}
                        alt={ticket.eventTitle}
                        fill
                        className="w-full h-full object-cover rounded-xl"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: 'cover', borderRadius: '0.75rem' }}
                        priority={index < 3}
                    />
                </div>
                <div className={`absolute top-3 left-3 ${statusStyle.color} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
                    {statusStyle.icon}
                    {statusStyle.label}
                </div>
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${categoryConfig.color}`}>
                    {categoryConfig.icon}
                </div>
                {isNearSoldOut && (
                    <div className="absolute bottom-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                        <HiOutlineFire className="w-3 h-3" />
                        Hot
                    </div>
                )}
            </div>

            <div className="mb-4">
                <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {ticket.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-1">{ticket.eventTitle}</p>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{ticket.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-center gap-1">
                        <div className="text-lg font-bold text-gray-900">
                            ${ticket.price}
                        </div>
                        {ticket.originalPrice > ticket.price && (
                            <div className="text-sm text-gray-500 line-through">
                                ${ticket.originalPrice}
                            </div>
                        )}
                    </div>
                    <div className="text-xs text-gray-600">Price</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-lg font-bold text-emerald-600">{ticket.sold}/{ticket.quantity}</div>
                    <div className="text-xs text-gray-600">Sold</div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-orange-600">${ticket.revenue.toLocaleString()}</div>
                <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full rounded-full ${isNearSoldOut ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                                isLowStock ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                    'bg-gradient-to-r from-emerald-500 to-green-500'
                                }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${soldPercentage}%` }}
                            transition={{ delay: index * 0.2, duration: 1 }}
                        />
                    </div>
                    <span className="text-xs text-gray-500">{Math.round(soldPercentage)}%</span>
                </div>
            </div>

            {/* Grid view menu */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between">
                    <button
                        onClick={() => onEdit(ticket)}
                        className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                        <FiEdit3 className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                        onClick={() => onDuplicate(ticket)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <FiCopy className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                        onClick={() => onToggleStatus(ticket)}
                        className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                    >
                        {ticket.status === 'active' ?
                            <FiAlertCircle className="w-4 h-4 text-yellow-500" /> :
                            <FiCheckCircle className="w-4 h-4 text-green-500" />
                        }
                    </button>
                    <button
                        onClick={() => onDelete(ticket)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <FiTrash2 className="w-4 h-4 text-red-500" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// Main Component
export default function TicketsPage(): JSX.Element {
    const [tickets, setTickets] = useState<TicketType[]>(mockTicketTypes);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedEvent, setSelectedEvent] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.eventTitle.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;
        const matchesEvent = selectedEvent === 'all' || ticket.eventId === selectedEvent;
        return matchesSearch && matchesStatus && matchesEvent;
    });

    const totalTickets = tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
    const totalSold = tickets.reduce((sum, ticket) => sum + ticket.sold, 0);
    const totalRevenue = tickets.reduce((sum, ticket) => sum + ticket.revenue, 0);
    const activeTickets = tickets.filter(ticket => ticket.status === 'active').length;

    const events = [...new Set(tickets.map(ticket => ({ id: ticket.eventId, title: ticket.eventTitle })))];

    const handleSaveTicket = (ticketData: TicketType): void => {
        const existingIndex = tickets.findIndex(t => t.id === ticketData.id);
        if (existingIndex >= 0) {
            // Update existing ticket
            const updatedTickets = [...tickets];
            updatedTickets[existingIndex] = ticketData;
            setTickets(updatedTickets);
        } else {
            // Add new ticket
            setTickets([...tickets, ticketData]);
        }
    };

    const handleEditTicket = (ticket: TicketType): void => {
        setSelectedTicket(ticket);
        setIsEditModalOpen(true);
    };

    const handleDeleteTicket = (ticket: TicketType): void => {
        setSelectedTicket(ticket);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteTicket = (ticketId: string): void => {
        setTickets(tickets.filter(t => t.id !== ticketId));
    };

    const handleDuplicateTicket = (ticket: TicketType): void => {
        const newTicket: TicketType = {
            ...ticket,
            id: `ticket${Date.now()}`,
            name: `${ticket.name} (Copy)`,
            status: 'draft',
            sold: 0,
            revenue: 0,
            salesVelocity: 0,
            conversionRate: 0,
            available: ticket.quantity
        };
        setTickets([...tickets, newTicket]);
    };

    const handleToggleStatus = (ticket: TicketType): void => {
        const newStatus: TicketType['status'] = ticket.status === 'active' ? 'paused' : 'active';
        const updatedTickets = tickets.map(t =>
            t.id === ticket.id ? { ...t, status: newStatus } : t
        );
        setTickets(updatedTickets);
    };

    return (
        <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
            {/* Header Section */}
            <motion.div
                className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute -top-8 -right-8 w-32 sm:w-40 h-32 sm:h-40 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-8 -left-8 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full blur-2xl"></div>

                <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 flex items-center gap-3">
                            <HiOutlineTicket className="w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12" />
                            Tickets
                        </h1>
                        <p className="text-orange-100 text-base sm:text-lg mb-4">
                            Manage ticket types • {totalTickets} total tickets • {totalSold} sold
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                                <IoSparkles className="w-5 h-5" />
                                <span className="font-semibold">${totalRevenue.toLocaleString()} revenue</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                                <FiTarget className="w-5 h-5" />
                                <span className="font-semibold">{activeTickets} active types</span>
                            </div>
                        </div>
                    </div>

                    <motion.button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-white text-orange-600 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg hover:bg-orange-50 transition-all shadow-lg flex items-center justify-center gap-3"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiPlus className="w-5 sm:w-6 h-5 sm:h-6" />
                        Create Ticket Type
                    </motion.button>
                </div>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                    {
                        label: 'Total Revenue',
                        value: `$${totalRevenue.toLocaleString()}`,
                        icon: <FiDollarSign className="w-5 sm:w-6 h-5 sm:h-6" />,
                        color: 'from-emerald-500 to-emerald-600',
                        change: '+23.5%',
                        gradient: true
                    },
                    {
                        label: 'Tickets Sold',
                        value: totalSold.toLocaleString(),
                        icon: <BsTicketPerforated className="w-5 sm:w-6 h-5 sm:h-6" />,
                        color: 'from-blue-500 to-blue-600',
                        change: '+18.2%'
                    },
                    {
                        label: 'Available',
                        value: (totalTickets - totalSold).toLocaleString(),
                        icon: <IoTicket className="w-5 sm:w-6 h-5 sm:h-6" />,
                        color: 'from-purple-500 to-purple-600',
                        change: '-5.3%'
                    },
                    {
                        label: 'Active Types',
                        value: activeTickets.toString(),
                        icon: <FiZap className="w-5 sm:w-6 h-5 sm:h-6" />,
                        color: 'from-orange-500 to-orange-600',
                        change: '+2'
                    }
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        className={`${stat.gradient ? `bg-gradient-to-br ${stat.color} text-white` : 'bg-white'} rounded-2xl p-4 sm:p-6 border ${stat.gradient ? 'border-emerald-300' : 'border-gray-100'} hover:shadow-xl transition-all duration-300`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`h-10 sm:h-12 w-10 sm:w-12 rounded-xl flex items-center justify-center ${stat.gradient ? 'bg-white/20 text-white' : 'bg-orange-50 text-orange-600'}`}>
                                {stat.icon}
                            </div>
                            <div className={`text-xs sm:text-sm font-bold ${stat.gradient ? 'text-white/90' : stat.change.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                                {stat.change}
                            </div>
                        </div>
                        <div>
                            <p className={`text-2xl sm:text-3xl font-bold mb-1 ${stat.gradient ? 'text-white' : 'text-gray-900'}`}>
                                {stat.value}
                            </p>
                            <p className={`text-xs sm:text-sm font-medium ${stat.gradient ? 'text-white/80' : 'text-gray-600'}`}>
                                {stat.label}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Controls Section */}
            <motion.div
                className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search tickets..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <select
                                value={selectedEvent}
                                onChange={(e) => setSelectedEvent(e.target.value)}
                                className="px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="all">All Events</option>
                                {events.map((event) => (
                                    <option key={event.id} value={event.id}>
                                        {event.title}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="paused">Paused</option>
                                <option value="sold_out">Sold Out</option>
                                <option value="draft">Draft</option>
                            </select>

                            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                                <motion.button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="bg-gray-600 rounded-sm"></div>
                                        ))}
                                    </div>
                                </motion.button>
                                <motion.button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="w-4 h-4 flex flex-col gap-0.5">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="bg-gray-600 h-0.5 rounded-sm"></div>
                                        ))}
                                    </div>
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Tickets Grid/List */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                {filteredTickets.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-gray-400 text-6xl mb-4">🎫</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No tickets found</h3>
                        <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                        <motion.button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Create Your First Ticket Type
                        </motion.button>
                    </div>
                ) : (
                    <div className={`${viewMode === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6'
                        : 'space-y-4 sm:space-y-6'
                        }`}>
                        {filteredTickets.map((ticket, index) => (
                            <TicketCard
                                key={ticket.id}
                                ticket={ticket}
                                index={index}
                                viewMode={viewMode}
                                onEdit={handleEditTicket}
                                onDelete={handleDeleteTicket}
                                onDuplicate={handleDuplicateTicket}
                                onToggleStatus={handleToggleStatus}
                            />
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Modals */}
            <TicketFormModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={handleSaveTicket}
            />

            <TicketFormModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedTicket(null);
                }}
                ticket={selectedTicket}
                onSave={handleSaveTicket}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedTicket(null);
                }}
                ticket={selectedTicket}
                onConfirm={confirmDeleteTicket}
            />
        </div>
    );
}