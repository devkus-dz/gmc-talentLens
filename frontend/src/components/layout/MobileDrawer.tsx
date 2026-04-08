"use client";

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavLink } from './DashboardLayout';

interface MobileDrawerProps {
    primaryLinks: NavLink[];
    secondaryLinks?: NavLink[];
    topSidebarContent?: ReactNode;
}

export default function MobileDrawer({ primaryLinks, secondaryLinks, topSidebarContent }: MobileDrawerProps) {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path || (path !== '/' && pathname.startsWith(`${path}/`));

    const closeDrawer = () => {
        const checkbox = document.getElementById('dashboard-drawer') as HTMLInputElement;
        if (checkbox) checkbox.checked = false;
    };

    return (
        <div className="drawer-side z-50 lg:hidden">

            <label htmlFor="dashboard-drawer" aria-label="close sidebar" className="drawer-overlay"></label>

            <div className="w-72 min-h-full bg-base-100 flex flex-col pt-24 pb-8 shadow-2xl">

                {topSidebarContent && (
                    <div className="px-6 mb-6 shrink-0">
                        {topSidebarContent}
                    </div>
                )}

                <ul className="flex flex-col gap-1.5 px-4 w-full text-sm font-medium shrink-0">
                    {primaryLinks.map((link) => {
                        const active = isActive(link.href);
                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    onClick={closeDrawer}
                                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all w-full ${active
                                        ? 'bg-base-200 text-primary font-bold shadow-sm border border-base-content/5'
                                        : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'
                                        }`}
                                >
                                    {link.icon}
                                    {link.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {secondaryLinks && secondaryLinks.length > 0 && (
                    <>
                        <div className="divider opacity-30 px-6 my-4 shrink-0"></div>
                        <ul className="flex flex-col gap-1.5 px-4 w-full text-sm font-medium mt-auto shrink-0">
                            {secondaryLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        onClick={closeDrawer}
                                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all w-full text-base-content/70 hover:bg-base-200 hover:text-base-content"
                                    >
                                        {link.icon}
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}