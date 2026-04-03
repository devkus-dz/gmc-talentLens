import { SchemaType, Schema } from '@google/generative-ai';

export interface Experience {
    company: string | null;
    position: string | null;
    startDate: string | null;
    endDate: string | null;
    description: string | null;
}

export interface Education {
    institution: string | null;
    degree: string | null;
    startDate: string | null;
    endDate: string | null;
}

export interface Language {
    name: string;
    level: string;
}

export interface Certification {
    name: string;
    issuer: string;
    date: string | null;
}

export interface ParsedResumeData {
    improvementTip: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    skills: string[];
    tags: string[];
    locale: string | null;
    yearsOfExperience: number | null;
    summary: string | null;
    experiences: Experience[];
    education: Education[];
    languages: Language[];
    certifications: Certification[];
}

export const resumeSchema: Schema = {
    type: SchemaType.OBJECT,
    properties: {
        firstName: { type: SchemaType.STRING, description: "Candidate's first name", nullable: true },
        lastName: { type: SchemaType.STRING, description: "Candidate's last name", nullable: true },
        email: { type: SchemaType.STRING, description: "Email address", nullable: true },
        phone: { type: SchemaType.STRING, description: "Phone number", nullable: true },
        skills: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "List of technical and soft skills. DO NOT include spoken languages here."
        },
        languages: {
            type: SchemaType.ARRAY,
            description: "List of spoken languages and their proficiency levels.",
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    name: { type: SchemaType.STRING, description: "Language name (e.g., English, French, Arabic)" },
                    level: {
                        type: SchemaType.STRING,
                        description: "MUST BE EXACTLY ONE OF: 'Elementary', 'Limited Working', 'Professional Working', 'Native / Bilingual'. If unspecified, default to 'Elementary'."
                    }
                }
            }
        },
        certifications: {
            type: SchemaType.ARRAY,
            description: "List of professional certifications, licenses, or courses.",
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    name: { type: SchemaType.STRING, description: "Name of the certification" },
                    issuer: { type: SchemaType.STRING, description: "Issuing organization (e.g., AWS, Coursera, Cisco)" },
                    date: { type: SchemaType.STRING, description: "Issue date or year", nullable: true }
                }
            }
        },
        tags: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "5 to 7 high-level categories representing the candidate's primary industry, professional field, and seniority."
        },
        locale: {
            type: SchemaType.STRING,
            description: "The 2-letter ISO language code of the original CV (e.g., 'en', 'fr', 'ar').",
            nullable: true
        },
        yearsOfExperience: { type: SchemaType.NUMBER, description: "Total years of experience", nullable: true },
        summary: {
            type: SchemaType.STRING,
            description: "A 2-3 sentence professional summary. If the CV lacks one, generate it based on their experience.",
            nullable: true
        },
        experiences: {
            type: SchemaType.ARRAY,
            description: "Work experience history",
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    company: { type: SchemaType.STRING, description: "Company Name", nullable: true },
                    position: { type: SchemaType.STRING, description: "Job Title", nullable: true },
                    startDate: { type: SchemaType.STRING, description: "Start Date", nullable: true },
                    endDate: { type: SchemaType.STRING, description: "End Date or Present", nullable: true },
                    description: { type: SchemaType.STRING, description: "Role description", nullable: true },
                }
            }
        },
        education: {
            type: SchemaType.ARRAY,
            description: "Education history",
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    institution: { type: SchemaType.STRING, description: "University or School", nullable: true },
                    degree: { type: SchemaType.STRING, description: "Degree obtained", nullable: true },
                    startDate: { type: SchemaType.STRING, description: "Start Date", nullable: true },
                    endDate: { type: SchemaType.STRING, description: "End Date", nullable: true },
                }
            }
        },
        improvementTip: {
            type: SchemaType.STRING,
            description: "A 2-sentence actionable tip on how the candidate can improve their CV to be more competitive.",
            nullable: true
        },
    }
};

export const RESUME_PROMPT_INSTRUCTION = `
You are a strict, highly precise data extraction system. Your job is to extract information from the provided document and format it according to the requested schema.

CRITICAL RULES:
1. NO HALLUCINATION: You must only extract data explicitly written in the document. 
2. PRESERVE ORIGINAL LANGUAGE (DO NOT TRANSLATE): You MUST extract all text in the EXACT original language of the document.
3. SEPARATE SKILLS, LANGUAGES & CERTIFICATIONS: 
   - Spoken languages go into the 'languages' array.
   - Certifications go into the 'certifications' array.
   - The 'skills' array is strictly for technical and soft skills.
4. STRICT LANGUAGE LEVELS: For the language 'level' field, you MUST map the candidate's text to EXACTLY one of these four values:
   - 'Elementary' (Use this for "Basic", "Beginner", "A1", "A2", or if NO level is specified).
   - 'Limited Working' (Use this for "Intermediate", "Conversational", "B1").
   - 'Professional Working' (Use this for "Advanced", "Fluent", "B2", "C1").
   - 'Native / Bilingual' (Use this for "Native", "Mother tongue", "C2", "Bilingual").
   DO NOT output any other string for the language level.
5. DETECT LOCALE: Identify the primary language of the document and output its 2-letter ISO code.
6. MANDATORY SUMMARY: If missing, write a highly professional 2-sentence summary in the original language.
7. TAG GENERATION: Generate 5 to 7 high-level industry tags.
8. CV IMPROVEMENT TIP: Provide a 2-sentence actionable tip on how to improve the CV.
`;