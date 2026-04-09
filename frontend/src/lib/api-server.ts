import { cookies } from 'next/headers';

/**
 * Server-side data fetching utility.
 */
export async function fetchFromServer(endpoint: string, options: RequestInit = {}) {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt')?.value;

    const backendBase = process.env.BACKEND_URL || 'https://gmc-talent-lens-backend.vercel.app';
    const baseUrl = `${backendBase}/api`;

    try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? {
                    'Cookie': `jwt=${token}`,
                    'Authorization': `Bearer ${token}`
                } : {}),
                ...options.headers,
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            console.error(`[Server Fetch Failed] ${endpoint} returned status: ${response.status}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error(`[Server Fetch Error] ${endpoint}:`, error);
        return null;
    }
}