import { z } from 'zod';

// We make everything partial since the frontend usually sends a PATCH request with only the updated arrays
export const updateResumeSchema = z.object({
    skills: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),

    languages: z.array(z.object({
        name: z.string().min(1, "Language name is required"),
        level: z.string().min(1, "Proficiency level is required")
    })).optional(),

    certifications: z.array(z.object({
        name: z.string().min(1, "Certification name is required"),
        issuer: z.string().min(1, "Issuer is required"),
        date: z.string().nullable().optional()
    })).optional(),

    experiences: z.array(z.object({
        company: z.string().nullable().optional(),
        position: z.string().nullable().optional(),
        startDate: z.string().nullable().optional(),
        endDate: z.string().nullable().optional(),
        description: z.string().nullable().optional()
    })).optional(),

    education: z.array(z.object({
        institution: z.string().nullable().optional(),
        degree: z.string().nullable().optional(),
        startDate: z.string().nullable().optional(),
        endDate: z.string().nullable().optional()
    })).optional()
}).strict(); // Prevents users from trying to inject fields like "userId" or "fileKey" manually