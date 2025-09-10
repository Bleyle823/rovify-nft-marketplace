/* eslint-disable @typescript-eslint/no-unused-vars */
// components/NotificationPopup.tsx
'use client';

import React, { forwardRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiBell, FiCalendar, FiMessageSquare, FiClock, FiUser, FiHeart,
    FiX, FiCheck, FiArrowRight
} from 'react-icons/fi';
import { IoTicket } from 'react-icons/io5';
import Link from 'next/link';

interface Notification {
    id: string;
    type: 'event' | 'friend' | 'message' | 'system' | 'reminder';
    title: string;
    content: string;
    time: string;
    read: boolean;
    priority: 'high' | 'medium' | 'low';
    link?: string;
}

interface NotificationPopupProps {
    notifications: Notification[];
    showNotifications: boolean;
    onClose: () => void;
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
    onRemoveNotification: (id: string) => void;
}

const NotificationPopup = forwardRef<HTMLDivElement, NotificationPopupProps>(({
    notifications,
    showNotifications,
    onClose,
    onMarkAsRead,
    onMarkAllAsRead,
    onRemoveNotification
}, ref) => {
    const [isMobile, setIsMobile] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const getNotificationIcon = (type: Notification['type']) => {
        const iconMap = {
            event: FiCalendar,
            friend: FiUser,
            message: FiMessageSquare,
            system: IoTicket,
            reminder: FiClock
        };
        const IconComponent = iconMap[type] || FiBell;
        return <IconComponent className="w-3 h-3" />;
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.read) {
            onMarkAsRead(notification.id);
        }
        if (notification.link) {
            onClose();
        }
    };

    return (
        <div ref={ref} className="relative">
            <AnimatePresence>
                {showNotifications && (
                    <>
                        {/* Mobile Overlay */}
                        {isMobile && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                                onClick={onClose}
                            />
                        )}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: isMobile ? 20 : 8,
                                scale: isMobile ? 0.95 : 0.96
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1
                            }}
                            exit={{
                                opacity: 0,
                                y: isMobile ? 20 : 8,
                                scale: isMobile ? 0.95 : 0.96
                            }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className={`
                                ${isMobile
                                    ? 'fixed bottom-0 left-0 right-0 mx-4 mb-4 rounded-t-3xl'
                                    : 'absolute right-0 top-2 w-80 rounded-xl'
                                }
                                bg-white/98 backdrop-blur-xl shadow-2xl border border-gray-200/40 overflow-hidden z-50
                            `}
                            style={{
                                boxShadow: isMobile
                                    ? '0 -10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.95)'
                                    : '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.95)',
                                maxHeight: isMobile ? 'calc(100vh - 120px)' : 'auto'
                            }}
                        >
                            {/* Enhanced Mobile Handle */}
                            {isMobile && (
                                <div className="flex justify-center pt-3 pb-1">
                                    <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                                </div>
                            )}

                            {/* Responsive Header */}
                            <div className={`flex items-center justify-between border-b border-gray-100/80 ${isMobile ? 'px-5 py-4' : 'px-4 py-3'
                                }`}>
                                <div className="flex items-center gap-2">
                                    <h3 className={`font-semibold text-gray-900 ${isMobile ? 'text-lg' : 'text-sm'
                                        }`}>
                                        Notifications
                                    </h3>
                                    {unreadCount > 0 && (
                                        <span className={`text-gray-500 bg-gray-100 rounded-full font-medium ${isMobile
                                            ? 'text-sm px-2.5 py-1'
                                            : 'text-xs px-1.5 py-0.5'
                                            }`}>
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    {unreadCount > 0 && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={onMarkAllAsRead}
                                            className={`text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 ${isMobile ? 'text-sm' : 'text-xs'
                                                }`}
                                        >
                                            <FiCheck className={isMobile ? 'w-4 h-4' : 'w-3 h-3'} />
                                            Mark all read
                                        </motion.button>
                                    )}

                                    {isMobile && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={onClose}
                                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                        >
                                            <FiX className="w-4 h-4 text-gray-600" />
                                        </motion.button>
                                    )}
                                </div>
                            </div>

                            {/* Responsive Notifications List */}
                            <div className={`overflow-y-auto ${isMobile ? 'max-h-96' : 'max-h-80'
                                }`}>
                                {notifications.length === 0 ? (
                                    <div className={`text-center ${isMobile ? 'p-12' : 'p-8'}`}>
                                        <FiBell className={`text-gray-300 mx-auto mb-3 ${isMobile ? 'w-12 h-12' : 'w-8 h-8'
                                            }`} />
                                        <p className={`text-gray-500 ${isMobile ? 'text-base' : 'text-sm'
                                            }`}>
                                            All caught up!
                                        </p>
                                    </div>
                                ) : (
                                    <div className={isMobile ? 'p-2' : 'p-1'}>
                                        {notifications.map((notification, index) => (
                                            <motion.div
                                                key={notification.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.02 }}
                                                className="group relative"
                                            >
                                                {notification.link ? (
                                                    <Link href={notification.link} onClick={() => handleNotificationClick(notification)}>
                                                        <NotificationItem
                                                            notification={notification}
                                                            isMobile={isMobile}
                                                            onRemove={onRemoveNotification}
                                                        />
                                                    </Link>
                                                ) : (
                                                    <div onClick={() => handleNotificationClick(notification)}>
                                                        <NotificationItem
                                                            notification={notification}
                                                            isMobile={isMobile}
                                                            onRemove={onRemoveNotification}
                                                        />
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Responsive Footer */}
                            {notifications.length > 0 && (
                                <div className={`border-t border-gray-100/80 ${isMobile ? 'p-5' : 'p-3'
                                    }`}>
                                    <Link href="/notifications" onClick={onClose}>
                                        <motion.button
                                            whileHover={{ x: 2 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`w-full text-left text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-between group ${isMobile ? 'text-base py-2' : 'text-sm'
                                                }`}
                                        >
                                            <span>View all notifications</span>
                                            <FiArrowRight className={`group-hover:translate-x-0.5 transition-transform ${isMobile ? 'w-4 h-4' : 'w-3 h-3'
                                                }`} />
                                        </motion.button>
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
});

// Separate NotificationItem component for cleaner code
const NotificationItem: React.FC<{
    notification: Notification;
    isMobile: boolean;
    onRemove: (id: string) => void;
}> = ({ notification, isMobile, onRemove }) => {
    const getNotificationIcon = (type: Notification['type']) => {
        const iconMap = {
            event: FiCalendar,
            friend: FiUser,
            message: FiMessageSquare,
            system: IoTicket,
            reminder: FiClock
        };
        const IconComponent = iconMap[type] || FiBell;
        return <IconComponent className={isMobile ? 'w-4 h-4' : 'w-3 h-3'} />;
    };

    return (
        <motion.div
            whileHover={{ x: 2, backgroundColor: "rgba(249, 250, 251, 0.8)" }}
            whileTap={{ scale: 0.98 }}
            className={`
                flex items-start gap-3 cursor-pointer transition-all duration-200 rounded-lg
                ${isMobile ? 'p-4 mx-1 my-1' : 'p-3 mx-1 my-0.5'}
                ${!notification.read
                    ? 'bg-blue-50/40 hover:bg-blue-50/60'
                    : 'hover:bg-gray-50/60'
                }
            `}
        >
            {/* Unread Indicator */}
            {!notification.read && (
                <div className={`rounded-full bg-blue-500 flex-shrink-0 ${isMobile
                    ? 'w-2 h-2 mt-3'
                    : 'w-1.5 h-1.5 mt-2'
                    }`} />
            )}

            {/* Icon */}
            <div className={`
                rounded-lg flex items-center justify-center flex-shrink-0
                ${isMobile ? 'w-8 h-8 mt-1' : 'w-6 h-6 mt-0.5'}
                ${!notification.read
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-500'
                }
            `}>
                {getNotificationIcon(notification.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                    <p className={`
                        font-medium truncate
                        ${isMobile ? 'text-base' : 'text-sm'}
                        ${!notification.read ? 'text-gray-900' : 'text-gray-700'}
                    `}>
                        {notification.title}
                    </p>
                    <span className={`text-gray-400 ml-2 flex-shrink-0 ${isMobile ? 'text-sm' : 'text-xs'
                        }`}>
                        {notification.time}
                    </span>
                </div>
                <p className={`text-gray-600 leading-relaxed ${isMobile ? 'text-sm' : 'text-xs'
                    }`}>
                    {notification.content}
                </p>
            </div>

            {/* Remove Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`
                    opacity-0 group-hover:opacity-100 rounded-full bg-gray-200/80 hover:bg-red-200 
                    flex items-center justify-center transition-all duration-200 flex-shrink-0
                    ${isMobile ? 'w-7 h-7 ml-2' : 'w-5 h-5 ml-1'}
                `}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onRemove(notification.id);
                }}
            >
                <FiX className={`text-gray-600 hover:text-red-600 ${isMobile ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5'
                    }`} />
            </motion.button>
        </motion.div>
    );
};

NotificationPopup.displayName = 'NotificationPopup';

export default NotificationPopup;