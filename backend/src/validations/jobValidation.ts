import { z } from 'zod';

export const createJobSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    department: z.string().optional(),
    location: z.string().optional(),
    employmentType: z.string().optional(),
    salaryRange: z.string().optional(),
    minYearsOfExperience: z.number().min(0, "Experience cannot be negative").default(0),
    requiredSkills: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED']).default('DRAFT')
});

export const updateJobSchema = createJobSchema.partial();

// Fixed: Using the correct parameter for custom enum error messages
export const updateApplicantStatusSchema = z.object({
    status: z.enum(
        ['Applied', 'In Review', 'Interview', 'Offered', 'Rejected'],
        { message: "Status must be Applied, In Review, Interview, Offered, or Rejected" }
    )
});