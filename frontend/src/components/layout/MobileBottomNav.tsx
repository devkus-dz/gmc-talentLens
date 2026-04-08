"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavLink } from './DashboardLayout';

interface MobileBottomNavProps {
    primaryLinks: NavLink[];
}

export default function MobileBottomNav({ primaryLinks }: MobileBottomNavProps) {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path || (path !== '/' && pathname.startsWith(`${path}/`));

    return (
        <div className="lg:hidden bg-base-100 border-t border-base-content/5 flex flex-row w-full h-16 shrink-0 z-40 print:hidden pb-safe">
            {primaryLinks.slice(0, 4).map((link) => {
                const active = isActive(link.href);
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`flex-1 flex flex-col items-center justify-center transition-colors ${active ? 'text-primary bg-primary/5' : 'text-base-content/60 hover:text-primary'
                            }`}
                    >
                        <div className={active ? "text-primary scale-110 transition-transform" : "transition-transform"}>
                            {link.icon}
                        </div>
                        <span className="text-[10px] mt-1 font-medium">{link.label}</span>
                    </Link>
                );
            })}
        </div>
    );
}