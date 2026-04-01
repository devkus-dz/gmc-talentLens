"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

/**
 * @typedef {Object} RegisterResponse
 * @property {string} token - The JWT authentication token.
 * @property {Object} user - The newly registered user's data.
 */

/**
 * Renders the authentication registration page and handles the account creation API request.
 * @returns {React.JSX.Element} The complete registration page layout.
 */
export default function RegisterPage(): React.JSX.Element {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);


    /**
   * Defines the expected structure of the backend's register response.
   */
    interface RegisterResponse {
        message: string;
        user: {
            id: string;
            email: string;
            role: "ADMIN" | "CANDIDATE" | "RECRUITER";
            firstName: string;
            lastName: string;
            profilePictureUrl: string | null;
            isLookingForJob: boolean;
            savedJobs: any[];
        };
    }

    /**
    * Handles the form submission, registers the user, and redirects based on role.
    * @param {React.SyntheticEvent<HTMLFormElement>} e - The form submission event.
    * @returns {Promise<void>}
    */
    const handleRegister = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await api.post<RegisterResponse>('/auth/register', {
                firstName,
                lastName,
                email,
                password,
            });

            // Save user data to localStorage for UI purposes (like the Navbar)
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Dynamic Routing based on Role!
            switch (response.data.user.role) {
                case 'ADMIN':
                    router.push('/admin/dashboard');
                    break;
                case 'RECRUITER':
                    router.push('/recruiter/dashboard');
                    break;
                case 'CANDIDATE':
                    router.push('/candidate/dashboard');
                    break;
                default:
                    // Fallback if the role is unrecognized
                    router.push('/auth/login');
                    break;
            }

        } catch (err: any) {
            setError(
                err.response?.data?.message || 'Failed to create account. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200/50 p-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-content/5">
                <div className="card-body p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                        <p className="text-base-content/60 text-sm">Join TalentLens and find your next role</p>
                    </div>

                    {error && (
                        <div className="alert alert-error text-sm rounded-xl mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <label className="form-control w-full">
                                <div className="label pb-1">
                                    <span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/50">
                                        First Name
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="Jane"
                                    required
                                    className="input input-bordered w-full bg-base-200/30 border-base-content/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary rounded-xl"
                                />
                            </label>

                            <label className="form-control w-full">
                                <div className="label pb-1">
                                    <span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/50">
                                        Last Name
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Doe"
                                    required
                                    className="input input-bordered w-full bg-base-200/30 border-base-content/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary rounded-xl"
                                />
                            </label>
                        </div>

                        <label className="form-control w-full">
                            <div className="label pb-1">
                                <span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/50">
                                    Email Address
                                </span>
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                required
                                className="input input-bordered w-full bg-base-200/30 border-base-content/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary rounded-xl"
                            />
                        </label>

                        <label className="form-control w-full">
                            <div className="label pb-1">
                                <span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/50">
                                    Password
                                </span>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={8}
                                className="input input-bordered w-full bg-base-200/30 border-base-content/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary rounded-xl"
                            />
                        </label>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full rounded-xl mt-4"
                        >
                            {isLoading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="text-center mt-6 text-sm">
                        <span className="text-base-content/60">Already have an account? </span>
                        <Link href="/auth/login" className="text-primary hover:underline font-bold">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}