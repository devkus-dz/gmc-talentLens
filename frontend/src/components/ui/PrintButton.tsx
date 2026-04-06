// frontend/src/components/ui/PrintButton.tsx
'use client';

import React, { JSX } from 'react';
import { Printer } from 'lucide-react';

export default function PrintButton(): JSX.Element {
    return (
        <button
            onClick={() => window.print()}
            className="btn btn-sm btn-outline gap-2 border-base-content/20 hover:bg-base-200 hover:text-base-content shadow-sm"
        >
            <Printer className="w-4 h-4" />
            Print Profile
        </button>
    );
}