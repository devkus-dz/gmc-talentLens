"use client";

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavLink } from './DashboardLayout';

interface SidebarProps {
    primaryLinks: NavLink[];
    secondaryLinks?: NavLink[];
    topSidebarContent?: ReactNode;
}

export default function Sidebar({ primaryLinks, secondaryLinks, topSidebarContent }: SidebarProps) {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path || (path !== '/' && pathname.startsWith(`${path}/`));

    return (
        <aside className="w-72 hidden lg:flex flex-col bg-base-100 border-r border-base-content/5 py-8 h-full overflow-y-auto shrink-0 print:hidden">

            {topSidebarContent && (
                <div className="px-6 mb-6 shrink-0">
                    {topSidebarContent}
                </div>
            )}

            {/* Primary Navigation */}
            <ul className="flex flex-col gap-1.5 px-4 w-full text-sm font-medium shrink-0">
                {primaryLinks.map((link) => {
                    const active = isActive(link.href);
                    return (
                        <li key={link.href}>
                            <Link
                                href={link.href}
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

            {/* Secondary Navigation (Pushed to bottom) */}
            {secondaryLinks && secondaryLinks.length > 0 && (
                <>
                    <div className="divider opacity-30 px-6 my-4 shrink-0"></div>
                    <ul className="flex flex-col gap-1.5 px-4 w-full text-sm font-medium mt-auto shrink-0">
                        {secondaryLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
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
        </aside>
    );
}