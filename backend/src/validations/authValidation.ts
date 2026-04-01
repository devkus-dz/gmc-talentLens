import { z } from 'zod';

// Handles role-specific requirements using .superRefine()
export const registerSchema = z.object({
    email: z.string().email("Invalid email address format"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    role: z.enum(['CANDIDATE', 'RECRUITER', 'ADMIN']).default('CANDIDATE'),

    // Candidate fields
    firstName: z.string().optional(),
    lastName: z.string().optional(),

    // Recruiter fields
    companyName: z.string().optional(),
    website: z.string().url("Must be a valid URL").optional().or(z.literal('')),
    companyDescription: z.string().optional()
}).superRefine((data, ctx) => {
    if (data.role === 'CANDIDATE') {
        if (!data.firstName) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['firstName'], message: "First name is required for candidates" });
        if (!data.lastName) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['lastName'], message: "Last name is required for candidates" });
    }
    if (data.role === 'RECRUITER') {
        if (!data.companyName) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['companyName'], message: "Company name is required for recruiters" });
    }
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address format"),
    password: z.string().min(1, "Password is required")
});

export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address format")
});

export const resetPasswordSchema = z.object({
    newPassword: z.string().min(8, "Password must be at least 8 characters long")
});