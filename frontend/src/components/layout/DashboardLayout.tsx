"use client";

import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileDrawer from './MobileDrawer';
import MobileBottomNav from './MobileBottomNav';
import { ReactNode, JSX } from 'react';

export type NavLink = {
    label: string;
    href: string;
    icon: ReactNode;
};

interface DashboardLayoutProps {
    children: ReactNode;
    primaryLinks: NavLink[];
    secondaryLinks?: NavLink[];
    topSidebarContent?: ReactNode;
}

export default function DashboardLayout({
    children,
    primaryLinks,
    secondaryLinks,
    topSidebarContent
}: DashboardLayoutProps): JSX.Element {
    return (
        <div className="min-h-screen bg-base-200">

            {/* Ambient Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] sm:w-[800px] sm:h-[800px] bg-indigo-500/15 dark:bg-indigo-500/10 blur-[100px] sm:blur-[150px] rounded-full pointer-events-none z-0"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-purple-500/15 dark:bg-purple-500/10 blur-[100px] sm:blur-[150px] rounded-full pointer-events-none z-0"></div>

            {/* THE EXPERT FIX */}
            <header className="fixed top-0 left-0 right-0 h-16 z-55 bg-base-100 shadow-sm border-b border-base-content/5 print:hidden">
                <Navbar />
            </header>

            {/* THE DRAWER */}
            <div className="drawer pt-16 min-h-screen relative z-10">
                <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

                <div className="drawer-content flex flex-col w-full relative">

                    <div className="flex flex-1 w-full relative z-10 print:block print:h-auto">

                        {/* DESKTOP SIDEBAR */}
                        <aside className="hidden lg:block sticky top-16 h-[calc(100vh-4rem)] z-40 shrink-0 border-r border-base-content/5 bg-base-100/50 backdrop-blur-md">
                            <Sidebar
                                primaryLinks={primaryLinks}
                                secondaryLinks={secondaryLinks}
                                topSidebarContent={topSidebarContent}
                            />
                        </aside>

                        {/* NATIVE SCROLL CONTENT */}
                        <main className="flex-1 w-full p-4 lg:p-8 pb-24 lg:pb-8">
                            <div className="max-w-[1600px] mx-auto w-full relative z-10">
                                {children}
                            </div>
                        </main>

                    </div>

                    {/* MOBILE BOTTOM NAV */}
                    <div className="fixed bottom-0 left-0 right-0 z-55 lg:hidden bg-base-100 border-t border-base-content/10 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] print:hidden">
                        <MobileBottomNav primaryLinks={primaryLinks} />
                    </div>

                </div>

                <MobileDrawer
                    primaryLinks={primaryLinks}
                    secondaryLinks={secondaryLinks}
                    topSidebarContent={topSidebarContent}
                />

            </div>
        </div>
    );
}