"use client";

import React, { JSX, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import ThemeToggle from '../ui/ThemeToggle';
import Logo from '../ui/Logo';
import NotificationDropdown from './NotificationDropdown';
import api from '@/lib/api';
import { Menu, Search, User, Settings, LogOut } from 'lucide-react';

interface LocalUser {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    profilePictureUrl: string | null;
}

export default function Navbar(): JSX.Element | null {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<LocalUser | null>(null);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

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

    const handleLogout = async (): Promise<void> => {
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

    const handleGlobalSearch = (e: React.FormEvent): void => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        const query = encodeURIComponent(searchQuery.trim());
        const currentRole = user?.role?.toUpperCase();

        if (currentRole === 'ADMIN') {
            router.push(`/admin/search?q=${query}`);
        } else if (currentRole === 'RECRUITER') {
            // --- FIX: Route recruiters to the new global search page ---
            router.push(`/recruiter/search?q=${query}`);
        } else {
            router.push(`/candidate/jobs?search=${query}`);
        }

        setSearchQuery('');
    };

    let searchPlaceholder = "Search...";
    const currentRole = user?.role?.toUpperCase();

    if (currentRole === 'CANDIDATE') searchPlaceholder = "Search jobs, skills, companies...";
    else if (currentRole === 'RECRUITER') searchPlaceholder = "Search candidates, jobs...";
    else if (currentRole === 'ADMIN') searchPlaceholder = "Search users, companies, jobs...";

    if (!isMounted) {
        return <div className="navbar bg-base-100 border-b border-base-content/5 px-4 lg:px-8 z-60 sticky top-0 h-16"></div>;
    }

    return (
        <div className="print:hidden navbar bg-base-100 border-b border-base-content/5 px-4 lg:px-8 z-60 sticky top-0 h-16">

            <div className="flex-1 flex items-center gap-2">
                <label htmlFor="dashboard-drawer" className="btn btn-ghost btn-circle drawer-button lg:hidden text-base-content">
                    <Menu className="w-5 h-5" />
                </label>

                <Logo />
            </div>

            <div className="hidden md:flex flex-none w-full max-w-md">
                <form onSubmit={handleGlobalSearch} className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/40" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="input w-full pl-10 bg-base-200/50 border-none focus:outline-primary/20 rounded-xl h-10 text-sm"
                    />
                    <button type="submit" className="hidden">Search</button>
                </form>
            </div>

            <div className="flex-1 flex justify-end items-center gap-1 sm:gap-3">
                <ThemeToggle />

                {user ? (
                    <>
                        <NotificationDropdown />

                        <div className="dropdown dropdown-end ml-1 sm:ml-2 pl-2 sm:pl-4 sm:border-l border-base-content/10">
                            <div tabIndex={0} role="button" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                                <div className="avatar placeholder border border-base-content/10 rounded-full p-0.5 hover:border-primary transition-colors">
                                    {user.profilePictureUrl ? (
                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-base-200">
                                            <img alt={`${user.firstName} ${user.lastName}`} src={user.profilePictureUrl} className="object-cover w-full h-full" />
                                        </div>
                                    ) : (
                                        <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center">
                                            <span className="text-xs font-bold uppercase">
                                                {user.firstName?.charAt(0) || ''}{user.lastName?.charAt(0) || ''}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <span className="text-sm font-medium hidden sm:block text-base-content/80">
                                    {user.firstName} {user.lastName}
                                </span>
                            </div>

                            <ul tabIndex={0} className="mt-4 z-50 p-2 shadow-xl menu menu-sm dropdown-content bg-base-100 rounded-2xl w-60 border border-base-content/10">
                                <li className="menu-title px-4 py-2">
                                    <span className="text-base-content font-bold block truncate">{user.firstName} {user.lastName}</span>
                                    <span className="text-xs text-base-content/50 font-medium truncate">{user.email}</span>
                                </li>
                                <div className="divider my-0"></div>
                                <li>
                                    <Link href={`/${user.role?.toLowerCase() || 'candidate'}/dashboard`} className="py-3 font-medium">
                                        <Menu className="w-4 h-4 text-base-content/60" /> Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link href={`/${user.role?.toLowerCase() || 'candidate'}/profile`} className="py-3 font-medium">
                                        <User className="w-4 h-4 text-base-content/60" /> My Profile
                                    </Link>
                                </li>
                                <div className="divider my-0"></div>
                                <li>
                                    <button onClick={handleLogout} className="text-error py-3 font-medium hover:bg-error/10 hover:text-error">
                                        <LogOut className="w-4 h-4" /> Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-2 ml-1 sm:ml-2 pl-2 sm:pl-4 sm:border-l border-base-content/10">
                        <Link href="/auth/login" className="btn btn-ghost btn-sm rounded-xl font-bold">Sign In</Link>
                        <Link href="/auth/register" className="btn btn-primary btn-sm rounded-xl shadow-sm">Get Started</Link>
                    </div>
                )}
            </div>
        </div>
    );
}