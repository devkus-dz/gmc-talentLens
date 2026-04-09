import { cookies } from 'next/headers';

/**
 * Server-side data fetching utility.
 * Automatically forwards HttpOnly cookies from the client request to the Express API.
 * @param {string} endpoint - The API endpoint (e.g., '/resumes/me').
 * @param {RequestInit} options - Standard fetch options.
 * @returns {Promise<any>} The parsed JSON response or null if it fails.
 */
export async function fetchFromServer(endpoint: string, options: RequestInit = {}) {
    // Await the cookies() promise (required in Next.js 15+)
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt')?.value;

    const backendBase = process.env.BACKEND_URL || 'http://localhost:5000';
    const baseUrl = `${backendBase}/api`;

    try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Cookie': `jwt=${token}` } : {}),
                ...options.headers,
            },
            // Prevent Next.js from aggressively caching dynamic user data
            cache: 'no-store'
        });

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error(`[Server Fetch Error] ${endpoint}:`, error);
        return null;
    }
}