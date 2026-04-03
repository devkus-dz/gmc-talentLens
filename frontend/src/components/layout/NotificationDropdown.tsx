"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export interface Notification {
    _id: string;
    title: string;
    message: string;
    isRead: boolean;
    type: string;
    createdAt: string;
    link?: string;
}

export default function NotificationDropdown() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            const data = res.data.data || res.data;
            setNotifications(data);
            setUnreadCount(data.filter((n: Notification) => !n.isRead).length);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();

        // Poll for new notifications every 60 seconds
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(n => n._id === id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.patch('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);

            // Programmatically close the DaisyUI dropdown
            (document.activeElement as HTMLElement)?.blur();
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            markAsRead(notification._id);
        }

        // Programmatically close the DaisyUI dropdown
        (document.activeElement as HTMLElement)?.blur();

        // Route them if the notification has a specific destination
        if (notification.type === 'APPLICATION_UPDATE' || notification.type === 'INTERVIEW') {
            router.push('/candidate/applications');
        } else if (notification.link) {
            const finalLink = notification.link.startsWith('/jobs')
                ? `/candidate${notification.link}`
                : notification.link;
            router.push(finalLink);
        }
    };

    return (
        <div className="dropdown dropdown-end">
            {/* The DaisyUI CSS engine uses this tabIndex={0} to open the dropdown on click */}
            <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle btn-sm relative"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-error rounded-full animate-pulse border-2 border-base-100"></span>
                )}
            </div>

            {/* The content is ALWAYS in the DOM, DaisyUI hides/shows it instantly */}
            <div tabIndex={0} className="dropdown-content z-100 menu p-0 mt-4 shadow-lg bg-base-100 rounded-2xl w-80 sm:w-96 border border-base-content/10 overflow-hidden">

                {/* Header */}
                <div className="p-4 border-b border-base-content/10 flex justify-between items-center bg-base-200/30">
                    <h3 className="font-bold text-base">Notifications</h3>
                    {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="text-xs font-semibold text-primary hover:text-primary-focus transition-colors">
                            Mark all as read
                        </button>
                    )}
                </div>

                {/* Body */}
                <div className="max-h-[60vh] overflow-y-auto thin-scrollbar flex flex-col">
                    {isLoading ? (
                        <div className="p-8 text-center"><span className="loading loading-spinner text-primary"></span></div>
                    ) : notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div
                                key={notification._id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`p-4 border-b border-base-content/5 cursor-pointer hover:bg-base-200/50 transition-colors flex gap-3 ${!notification.isRead ? 'bg-primary/5' : ''}`}
                            >
                                <div className="mt-1 shrink-0">
                                    {!notification.isRead ? (
                                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                                    ) : (
                                        <div className="w-2 h-2 rounded-full bg-base-content/20 mt-1.5"></div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className={`text-sm ${!notification.isRead ? 'font-bold text-base-content' : 'font-semibold text-base-content/80'}`}>
                                        {notification.title}
                                    </h4>
                                    <p className="text-xs text-base-content/60 mt-0.5 line-clamp-2 leading-relaxed">
                                        {notification.message}
                                    </p>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 mt-2 block">
                                        {new Date(notification.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center flex flex-col items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-base-content/20 mb-2"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
                            <p className="text-sm text-base-content/50 font-medium">You're all caught up!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}