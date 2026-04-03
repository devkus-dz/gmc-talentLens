import { SchemaType, Schema } from '@google/generative-ai';

/**
 * @interface MatchResult
 * The expected output from Gemini with a detailed score breakdown.
 */
export interface MatchResult {
    resumeId: string;
    scores: {
        skillsMatch: number;
        experienceMatch: number;
        cultureOrTitleFit: number;
        overallScore: number;
    };
    explanation: string;
}

/**
 * @constant jobMatchSchema
 * The structured output schema forcing the AI to return a detailed breakdown.
 */
export const jobMatchSchema: Schema = {
    type: SchemaType.ARRAY,
    description: "An array of candidate evaluations with detailed score breakdowns.",
    items: {
        type: SchemaType.OBJECT,
        properties: {
            resumeId: {
                type: SchemaType.STRING,
                description: "The unique ID of the resume being evaluated."
            },
            scores: {
                type: SchemaType.OBJECT,
                description: "A detailed breakdown of the candidate's fit.",
                properties: {
                    skillsMatch: {
                        type: SchemaType.NUMBER,
                        description: "0-100 score based strictly on overlapping required skills, technical tags, and language proficiency requirements."
                    },
                    experienceMatch: {
                        type: SchemaType.NUMBER,
                        description: "0-100 score. Give 100 if they meet or exceed the required years. Deduct heavily if under."
                    },
                    cultureOrTitleFit: {
                        type: SchemaType.NUMBER,
                        description: "0-100 score. How well their current title, summary, and past responsibilities align with the role's seniority and focus."
                    },
                    overallScore: {
                        type: SchemaType.NUMBER,
                        description: "A holistic 0-100 score representing the final match percentage."
                    }
                }
            },
            explanation: {
                type: SchemaType.STRING,
                description: "A strict 1-to-2 sentence explanation justifying the overall score and highlighting specific strengths or missing gaps."
            }
        }
    }
};

/**
 * Builds the prompt for evaluating multiple candidates against a single job description.
 * @param {string} jobOfferText - The text description and requirements of the job.
 * @param {any[]} candidatesToEvaluate - An array of stripped-down candidate objects.
 * @returns {string} The fully constructed prompt.
 */
export const buildJobMatchPrompt = (jobOfferText: string, candidatesToEvaluate: any[]): string => `
You are an expert Technical HR Recruiter and ATS AI. Your job is to deeply evaluate a list of candidates against a specific Job Offer.

JOB OFFER DETAILS:
"""
${jobOfferText}
"""

CANDIDATES TO EVALUATE:
"""
${JSON.stringify(candidatesToEvaluate, null, 2)}
"""

CRITICAL SCORING RULES:
1. Evaluate EVERY candidate in the provided list.
2. Provide a detailed score breakdown (0-100) for Skills, Experience, and Title/Culture fit.
3. Be highly critical. A 100 overall score means a perfect, unicorn fit. Most good candidates should be in the 70-85 range.
4. If a candidate completely lacks the core required skills or is drastically under the experience requirement, their overallScore should be below 40.
5. Write a 1-to-2 sentence explanation justifying the scores. Be direct, objective, and reference specific skills or years of experience in your explanation.
6. STRICT LANGUAGE PROFICIENCY MAPPING: Candidates' language levels are strictly standardized to four tiers. When evaluating language requirements from the Job Offer, map them accordingly:
   - 'Elementary' (Matches Basic/Beginner requirements)
   - 'Limited Working' (Matches Intermediate/Conversational requirements)
   - 'Professional Working' (Matches Fluent/Advanced requirements)
   - 'Native / Bilingual' (Matches Native/Mother-tongue requirements)
   Factor language discrepancies heavily into the skillsMatch and overallScore.
`;