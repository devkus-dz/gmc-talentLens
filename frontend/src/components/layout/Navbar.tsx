"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ThemeToggle from '../ui/ThemeToggle';
import NotificationDropdown from './NotificationDropdown';
import api from '@/lib/api';

interface LocalUser {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    profilePictureUrl: string | null;
}

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<LocalUser | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    // Global Search State
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setIsMounted(true);
        const loadUser = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (error) {
                    console.error('Failed to parse user data from local storage');
                }
            }
        };
        loadUser();
        window.addEventListener('user-updated', loadUser);
        return () => window.removeEventListener('user-updated', loadUser);
    }, []);

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

    const handleGlobalSearch = (e: React.FormEvent) => {
        e.preventDefault(); // Prevents the page from doing a hard refresh

        if (!searchQuery.trim()) return;

        const query = encodeURIComponent(searchQuery.trim());
        const currentRole = user?.role?.toUpperCase();

        if (currentRole === 'RECRUITER') {
            router.push(`/recruiter/jobs?search=${query}`);
        } else if (currentRole === 'ADMIN') {
            router.push(`/admin/candidates?search=${query}`);
        } else {
            // Default fallback to Candidate (just in case role is missing or undefined)
            router.push(`/candidate/jobs?search=${query}`);
        }

        // Clear the navbar search box after routing
        setSearchQuery('');
    };

    // Dynamic Placeholder text
    let searchPlaceholder = "Search...";
    const currentRole = user?.role?.toUpperCase();

    if (currentRole === 'CANDIDATE') searchPlaceholder = "Search jobs, skills, companies...";
    else if (currentRole === 'RECRUITER') searchPlaceholder = "Search candidates, jobs...";
    else if (currentRole === 'ADMIN') searchPlaceholder = "Search users, candidates...";

    if (!isMounted) {
        return <div className="navbar bg-base-100 border-b border-base-content/5 px-4 lg:px-8 z-50 sticky top-0 h-16"></div>;
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

            {/* Center: Global Search wrapped in a Form! */}
            <div className="hidden md:flex flex-none w-full max-w-md">
                <form onSubmit={handleGlobalSearch} className="relative w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="input w-full pl-10 bg-base-200/50 border-none focus:outline-primary/20 rounded-xl h-10 text-sm"
                    />
                </form>
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex-1 flex justify-end items-center gap-1 sm:gap-3">

                <ThemeToggle />

                {user ? (
                    <>
                        <NotificationDropdown />

                        <div className="dropdown dropdown-end ml-1 sm:ml-2 pl-2 sm:pl-4 sm:border-l border-base-content/10">
                            <div tabIndex={0} role="button" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                                <div className="avatar placeholder">
                                    {user.profilePictureUrl ? (
                                        <div className="w-8 h-8 rounded-full overflow-hidden">
                                            <img alt={`${user.firstName} ${user.lastName}`} src={user.profilePictureUrl} className="object-cover w-full h-full" />
                                        </div>
                                    ) : (
                                        <div className="bg-primary text-primary-content rounded-full w-8 h-8 flex items-center justify-center">
                                            <span className="text-xs font-bold uppercase">
                                                {user.firstName?.charAt(0) || ''}{user.lastName?.charAt(0) || ''}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <span className="text-sm font-medium hidden sm:block">
                                    {user.firstName} {user.lastName}
                                </span>
                            </div>

                            <ul tabIndex={0} className="mt-4 z-1 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-content/10">
                                <li className="menu-title px-4 py-2">
                                    <span className="text-base-content font-semibold block truncate">{user.firstName} {user.lastName}</span>
                                    <span className="text-xs text-base-content/60 font-normal truncate">{user.email}</span>
                                </li>
                                <div className="divider my-0"></div>
                                <li><Link href={`/${user.role?.toLowerCase() || 'candidate'}/dashboard`}>Dashboard</Link></li>
                                <li><Link href={`/${user.role?.toLowerCase() || 'candidate'}/profile`}>My Profile</Link></li>
                                <div className="divider my-0"></div>
                                <li><button onClick={handleLogout} className="text-error hover:bg-error/10 hover:text-error">Logout</button></li>
                            </ul>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-2 ml-1 sm:ml-2 pl-2 sm:pl-4 sm:border-l border-base-content/10">
                        <Link href="/auth/login" className="btn btn-ghost btn-sm rounded-xl">Sign In</Link>
                        <Link href="/auth/register" className="btn btn-primary btn-sm rounded-xl">Get Started</Link>
                    </div>
                )}
            </div>
        </div>
    );
}