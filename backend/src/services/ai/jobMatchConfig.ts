import { SchemaType, Schema } from '@google/generative-ai';

/**
 * @interface MatchResult
 * The expected output from Gemini when scoring a candidate against a job offer.
 */
export interface MatchResult {
    resumeId: string;
    matchScore: number;
    explanation: string;
}

/**
 * @constant jobMatchSchema
 * The structured output schema for candidate evaluation.
 */
export const jobMatchSchema: Schema = {
    type: SchemaType.ARRAY,
    description: "An array of candidate evaluations",
    items: {
        type: SchemaType.OBJECT,
        properties: {
            resumeId: {
                type: SchemaType.STRING,
                description: "The unique ID of the resume being evaluated"
            },
            matchScore: {
                type: SchemaType.NUMBER,
                description: "A score from 0 to 100 representing how well the candidate fits the job"
            },
            explanation: {
                type: SchemaType.STRING,
                description: "A strict 1-to-2 sentence explanation of exactly why this score was given, highlighting strengths or missing gaps."
            }
        }
    }
};

/**
 * Builds the prompt for evaluating multiple candidates against a single job description.
 * * @param {string} jobOfferText - The text description and requirements of the job.
 * @param {any[]} candidatesToEvaluate - An array of stripped-down candidate objects.
 * @returns {string} The fully constructed prompt.
 */
export const buildJobMatchPrompt = (jobOfferText: string, candidatesToEvaluate: any[]): string => `
You are an expert HR Recruiter and ATS AI. Your job is to evaluate a list of candidates against a specific Job Offer.

JOB OFFER DETAILS:
"""
${jobOfferText}
"""

CANDIDATES TO EVALUATE:
"""
${JSON.stringify(candidatesToEvaluate, null, 2)}
"""

CRITICAL RULES:
1. Evaluate EVERY candidate in the provided list.
2. Be highly critical. A 100% score means a perfect, unicorn fit. Most good candidates should be in the 70-85% range.
3. Penalize heavily if the candidate lacks the 'minYearsOfExperience' required by the job.
4. Write a 1-to-2 sentence explanation justifying the score. Be direct and objective.
`;