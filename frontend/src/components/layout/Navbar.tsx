import Link from 'next/link';
import ThemeToggle from '../ui/ThemeToggle';

export default function Navbar() {
    return (
        <div className="navbar bg-base-100 border-b border-base-content/5 px-4 lg:px-8 z-50 sticky top-0 h-16">

            {/* Left: Mobile Drawer Toggle & Logo */}
            <div className="flex-1 flex items-center">
                <label htmlFor="dashboard-drawer" className="btn btn-ghost drawer-button lg:hidden mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                </label>
                <Link href="/" className="text-xl font-bold text-primary flex items-center gap-2">
                    {/* Mock Logo Icon */}
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
                {/* Notification Bell */}
                <button className="btn btn-ghost btn-circle btn-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                </button>

                {/* Theme Toggle Component */}
                <ThemeToggle />

                {/* User Profile */}
                <div className="flex items-center gap-2 ml-2 pl-2 sm:pl-4 sm:border-l border-base-content/10 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="avatar">
                        <div className="w-8 h-8 rounded-full">
                            <img alt="Alex Rivera" src="https://ui-avatars.com/api/?name=Alex+Rivera&background=111827&color=fff" />
                        </div>
                    </div>
                    <span className="text-sm font-medium hidden sm:block">Alex Rivera</span>
                </div>
            </div>
        </div>
    );
}