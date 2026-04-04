import React, { JSX } from 'react';
import Link from 'next/link';

/**
 * Standardized application logo component.
 * @component
 * @returns {JSX.Element}
 */
export default function Logo(): JSX.Element {
    return (
        <Link href="/" className="text-xl font-bold text-primary flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                <div className="w-2 h-2 bg-base-100 rounded-full"></div>
            </div>
            TalentLens
        </Link>
    );
}