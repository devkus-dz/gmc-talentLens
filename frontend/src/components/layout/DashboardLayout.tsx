"use client";

import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileDrawer from './MobileDrawer';
import MobileBottomNav from './MobileBottomNav';
import { ReactNode, JSX } from 'react';

/**
 * Defines the navigation link structure.
 * @typedef {Object} NavLink
 * @property {string} label - The visible text of the link.
 * @property {string} href - The URL path.
 * @property {ReactNode} icon - The Lucide icon component.
 */
export type NavLink = {
    label: string;
    href: string;
    icon: ReactNode;
};

/**
 * Properties for the DashboardLayout component.
 * @typedef {Object} DashboardLayoutProps
 * @property {ReactNode} children - The main page content.
 * @property {NavLink[]} primaryLinks - The main navigation links.
 * @property {NavLink[]} [secondaryLinks] - Optional bottom/settings links.
 * @property {ReactNode} [topSidebarContent] - Optional content above the links (like a user profile or system badge).
 */
interface DashboardLayoutProps {
    children: ReactNode;
    primaryLinks: NavLink[];
    secondaryLinks?: NavLink[];
    topSidebarContent?: ReactNode;
}

/**
 * Renders the master dashboard layout with ambient glowing backgrounds.
 * Uses a robust Flexbox architecture to prevent element overlapping.
 * @param {DashboardLayoutProps} props - The layout properties.
 * @returns {JSX.Element} The fully structured layout.
 */
export default function DashboardLayout({
    children,
    primaryLinks,
    secondaryLinks,
    topSidebarContent
}: DashboardLayoutProps): JSX.Element {
    return (
        <div className="drawer">
            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content flex flex-col min-h-dvh h-dvh overflow-hidden bg-base-200 relative print:h-auto print:overflow-visible print:bg-white">

                {/* --- AMBIENT GLOW EFFECT --- */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] sm:w-[800px] sm:h-[800px] bg-indigo-500/15 dark:bg-indigo-500/10 blur-[100px] sm:blur-[150px] rounded-full pointer-events-none z-0"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-purple-500/15 dark:bg-purple-500/10 blur-[100px] sm:blur-[150px] rounded-full pointer-events-none z-0"></div>

                {/* Navbar Area */}
                <div className="shrink-0 z-55 shadow-sm relative w-full flex border-b border-base-content/5">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 z-55 lg:hidden">
                        <label htmlFor="dashboard-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </label>
                    </div>
                    <div className="w-full">
                        <Navbar />
                    </div>
                </div>

                {/* Middle Area */}
                <div className="flex flex-1 min-h-0 overflow-hidden relative z-10 print:block print:h-auto print:overflow-visible">

                    {/* Desktop Sidebar */}
                    <Sidebar
                        primaryLinks={primaryLinks}
                        secondaryLinks={secondaryLinks}
                        topSidebarContent={topSidebarContent}
                    />

                    {/* Main Scrollable Content */}
                    <main className="flex-1 overflow-y-auto p-4 lg:p-8 flex flex-col relative print:overflow-visible print:h-auto print:p-0 print:m-0">
                        <div className="max-w-[1600px] mx-auto w-full flex-1 flex flex-col relative z-10">
                            {children}
                        </div>
                        <div className="h-8 w-full shrink-0"></div>
                    </main>
                </div>

                {/* Mobile Bottom Navigation Component */}
                <div className="relative z-50">
                    <MobileBottomNav primaryLinks={primaryLinks} />
                </div>

            </div>

            {/* Mobile Drawer Slide-out Menu */}
            <MobileDrawer
                primaryLinks={primaryLinks}
                secondaryLinks={secondaryLinks}
                topSidebarContent={topSidebarContent}
            />

        </div>
    );
}