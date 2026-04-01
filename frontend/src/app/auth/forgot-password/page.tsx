"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

/**
 * Defines the expected response structure from the forgot password endpoint.
 */
interface ForgotPasswordResponse {
    message: string;
}

/**
 * Renders the forgot password page allowing users to request a password reset link.
 * @returns {React.JSX.Element} The forgot password page layout.
 */
export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    /**
     * Handles the submission of the email to request a reset link.
     * @param {React.SyntheticEvent<HTMLFormElement>} e - The form submission event.
     * @returns {Promise<void>}
     */
    const handleRequestReset = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            // Note: Verify this matches your exact backend POST route in ROUTES.md
            await api.post<ForgotPasswordResponse>('/auth/forgot-password', { email });
            setStatus('success');
        } catch (err: any) {
            setStatus('error');
            setErrorMessage(
                err.response?.data?.message || 'Failed to send reset email. Please try again.'
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200/50 p-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-content/5">
                <div className="card-body p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
                        <p className="text-base-content/60 text-sm">
                            Enter your email and we will send you a link to reset your password.
                        </p>
                    </div>

                    {status === 'success' ? (
                        <div className="text-center">
                            <div className="alert alert-success text-sm rounded-xl mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>Check your email for the reset link!</span>
                            </div>
                            <Link href="/auth/login" className="btn btn-outline w-full rounded-xl">
                                Return to Sign In
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleRequestReset} className="flex flex-col gap-4">
                            {status === 'error' && (
                                <div className="alert alert-error text-sm rounded-xl">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>{errorMessage}</span>
                                </div>
                            )}

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

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="btn btn-primary w-full rounded-xl mt-4"
                            >
                                {status === 'loading' ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </button>
                        </form>
                    )}

                    {status !== 'success' && (
                        <div className="text-center mt-6 text-sm">
                            <Link href="/auth/login" className="text-primary hover:underline font-bold">
                                Back to Sign In
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}