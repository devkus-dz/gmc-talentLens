"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ThemeToggle from '../ui/ThemeToggle';
import api from '@/lib/api';

/**
 * Defines the user structure stored in localStorage.
 */
interface LocalUser {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    profilePictureUrl: string | null;
}

/**
 * Renders the main application navigation bar, preserving the custom layout
 * while integrating dynamic authentication state and dropdown menus.
 * @returns {React.JSX.Element} The Navbar component.
 */
export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<LocalUser | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Failed to parse user data from local storage');
            }
        }
    }, []);

    /**
     * Handles the logout process by calling the backend, clearing local storage, and redirecting.
     * @returns {Promise<void>}
     */
    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout request failed, proceeding with local cleanup', error);
        } finally {
            localStorage.removeItem('user');
            setUser(null);
            router.push('/auth/login');
        }
    };

    if (!isMounted) {
        return (
            <div className="navbar bg-base-100 border-b border-base-content/5 px-4 lg:px-8 z-50 sticky top-0 h-16"></div>
        );
    }

    return (
        <div className="navbar bg-base-100 border-b border-base-content/5 px-4 lg:px-8 z-50 sticky top-0 h-16">

            {/* Left: Logo */}
            <div className="flex-1 flex items-center">
                <Link href="/" className="text-xl font-bold text-primary flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-2 h-2 bg-base-100 rounded-full"></div>
                    </div>
                    TalentLens
                </Link>
            </div>

            {/* Center: Global Search */}
            <div className="hidden md:flex flex-none w-full max-w-md">
                <div className="relative w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search jobs, skills, companies..."
                        className="input w-full pl-10 bg-base-200/50 border-none focus:outline-primary/20 rounded-xl h-10 text-sm"
                    />
                </div>
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex-1 flex justify-end items-center gap-1 sm:gap-3">

                {/* Theme Toggle Component (Always visible) */}
                <ThemeToggle />

                {user ? (
                    <>
                        {/* Notification Bell (Visible only when logged in) */}
                        <button className="btn btn-ghost btn-circle btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button>

                        {/* User Profile Dropdown */}
                        <div className="dropdown dropdown-end ml-1 sm:ml-2 pl-2 sm:pl-4 sm:border-l border-base-content/10">
                            <div tabIndex={0} role="button" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                                <div className="avatar placeholder">
                                    {user.profilePictureUrl ? (
                                        <div className="w-8 h-8 rounded-full">
                                            <img alt={`${user.firstName} ${user.lastName}`} src={user.profilePictureUrl} />
                                        </div>
                                    ) : (
                                        <div className="bg-primary text-primary-content rounded-full w-8 h-8 flex items-center justify-center">
                                            <span className="text-xs font-bold uppercase">
                                                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <span className="text-sm font-medium hidden sm:block">
                                    {user.firstName} {user.lastName}
                                </span>
                            </div>

                            {/* Dropdown Menu */}
                            <ul tabIndex={0} className="mt-4 z-1 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-content/10">
                                <li className="menu-title px-4 py-2">
                                    <span className="text-base-content font-semibold block">{user.firstName} {user.lastName}</span>
                                    <span className="text-xs text-base-content/60 font-normal">{user.email}</span>
                                </li>
                                <div className="divider my-0"></div>
                                <li>
                                    <Link href={`/${user.role?.toLowerCase() || 'candidate'}/dashboard`}>Dashboard</Link>
                                </li>
                                <li>
                                    <Link href="/profile">My Profile</Link>
                                </li>
                                <div className="divider my-0"></div>
                                <li>
                                    <button onClick={handleLogout} className="text-error hover:bg-error/10 hover:text-error">
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </>
                ) : (
                    /* Login/Register Actions (Visible only when logged out) */
                    <div className="flex items-center gap-2 ml-1 sm:ml-2 pl-2 sm:pl-4 sm:border-l border-base-content/10">
                        <Link href="/auth/login" className="btn btn-ghost btn-sm rounded-xl">
                            Sign In
                        </Link>
                        <Link href="/auth/register" className="btn btn-primary btn-sm rounded-xl">
                            Get Started
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
}