"use client";

import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileDrawer from './MobileDrawer';
import MobileBottomNav from './MobileBottomNav';
import { ReactNode } from 'react';

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
}: DashboardLayoutProps) {
    return (
        <div className="drawer">

            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content flex flex-col min-h-dvh h-dvh overflow-hidden bg-base-200/50 print:h-auto print:overflow-visible print:bg-white">

                {/* Navbar Area  */}
                <div className="shrink-0 z-55 shadow-sm relative w-full">
                    <Navbar />
                </div>

                {/* Middle Area */}
                <div className="flex flex-1 min-h-0 overflow-hidden relative print:block print:h-auto print:overflow-visible">

                    {/* Desktop Sidebar (hidden on mobile) */}
                    <Sidebar
                        primaryLinks={primaryLinks}
                        secondaryLinks={secondaryLinks}
                        topSidebarContent={topSidebarContent}
                    />

                    {/* Main Scrollable Content */}
                    <main className="flex-1 overflow-y-auto p-4 lg:p-8 flex flex-col relative print:overflow-visible print:h-auto print:p-0 print:m-0">
                        <div className="max-w-[1600px] mx-auto w-full flex-1 flex flex-col">
                            {children}
                        </div>
                        <div className="h-8 w-full shrink-0"></div>
                    </main>
                </div>

                {/* Mobile Bottom Navigation Component */}
                <MobileBottomNav primaryLinks={primaryLinks} />

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