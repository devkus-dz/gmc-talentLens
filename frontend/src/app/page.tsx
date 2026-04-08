import React, { JSX } from 'react';
import HomeClient from '@/components/home/HomeClient';
import { Metadata } from 'next';

/**
 * SEO Metadata for the main landing page.
 * This is parsed by search engine crawlers before the client hydrates.
 */
export const metadata: Metadata = {
  title: 'TalentLens | AI-Powered ATS',
  description: 'The next-generation ATS that uses AI to score candidates, automate pipelines, and connect top talent with top companies instantly.',
  keywords: ['ATS', 'Applicant Tracking System', 'AI Recruiting', 'TalentLens', 'Jobs'],
};

/**
 * Server Component for the Landing Page.
 * Ensures optimal SEO and Core Web Vitals while delegating interactivity to the Client Component.
 * @returns {JSX.Element} The server-rendered page layout.
 */
export default function HomePage(): JSX.Element {
  return <HomeClient />;
}