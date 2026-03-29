"use client";

import Navbar from './Navbar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

// Define the shape of our navigation links
export type NavLink = {
    label: string;
    href: string;
    icon: ReactNode;
};

interface DashboardLayoutProps {
    children: ReactNode;
    primaryLinks: NavLink[];
    secondaryLinks?: NavLink[]; // Optional: For Settings/Support at the bottom
    topSidebarContent?: ReactNode; // Optional: For the Admin "System Mode" badge
}

export default function DashboardLayout({
    children,
    primaryLinks,
    secondaryLinks,
    topSidebarContent
}: DashboardLayoutProps) {

    const pathname = usePathname();
    // Safe active check (ensures exact match for root dashboards, and startsWith for sub-pages)
    const isActive = (path: string) => pathname === path || (path !== '/' && pathname.startsWith(`${path}/`));

    return (
        <div className="h-screen overflow-hidden bg-base-200/50 flex flex-col">
            <Navbar />

            <div className="drawer lg:drawer-open flex-1 min-h-0 relative">
                <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

                {/* Main Scrollable Content */}
                <div className="drawer-content overflow-y-auto p-4 lg:p-8 flex flex-col">
                    {children}
                    <div className="h-8 w-full shrink-0"></div>
                </div>

                {/* Desktop Sidebar */}
                <div className="drawer-side z-40">
                    <label htmlFor="dashboard-drawer" aria-label="close sidebar" className="drawer-overlay"></label>

                    <div className="w-72 h-full bg-base-200/30 border-r border-base-content/5 pt-24 lg:pt-8 flex flex-col pb-8">

                        {/* Optional Top Content (e.g., Admin Badge) */}
                        {topSidebarContent && (
                            <div className="px-6 mb-6">
                                {topSidebarContent}
                            </div>
                        )}

                        {/* Primary Navigation */}
                        <ul className="flex flex-col gap-1.5 px-4 w-full text-sm font-medium">
                            {primaryLinks.map((link) => {
                                const active = isActive(link.href);
                                return (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all w-full ${active
                                                    ? 'bg-base-100 text-primary font-bold shadow-sm border border-base-content/5'
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

                        {/* Optional Secondary Navigation (Settings, Support) */}
                        {secondaryLinks && secondaryLinks.length > 0 && (
                            <>
                                <div className="divider opacity-30 px-6 my-2"></div>
                                <ul className="flex flex-col gap-1.5 px-4 w-full text-sm font-medium mt-auto">
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
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Navigation (Only shows Primary Links) */}
            <div className="lg:hidden bg-base-100 border-t border-base-content/5 flex flex-row w-full h-16 shrink-0 z-50">
                {primaryLinks.slice(0, 4).map((link) => { // Limit to 4 for mobile space
                    const active = isActive(link.href);
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex-1 flex flex-col items-center justify-center transition-colors ${active ? 'text-primary bg-primary/5' : 'text-base-content/60 hover:text-primary'
                                }`}
                        >
                            <div className={active ? "text-primary" : ""}>
                                {link.icon}
                            </div>
                            <span className="text-[10px] mt-1 font-medium">{link.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}