import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
// @ts-ignore
const pdfParse = require('pdf-parse');

// Import AI Configurations
import { resumeSchema, ParsedResumeData, RESUME_PROMPT_INSTRUCTION } from './ai/resumeConfig';
import { jobMatchSchema, MatchResult, buildJobMatchPrompt } from './ai/jobMatchConfig';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

/**
 * Model initialization for Resume Extraction (Strict Data parsing)
 */
const resumeModel = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
        temperature: 0.0, // 0.0 for strict factual extraction
        responseMimeType: 'application/json',
        responseSchema: resumeSchema,
    }
});

/**
 * Model initialization for Job Matching (Slightly analytical)
 */
const matchModel = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
        temperature: 0.1, // 0.1 for analytical reasoning
        responseMimeType: 'application/json',
        responseSchema: jobMatchSchema,
    }
});

/**
 * Core Service to interact with Google Gemini AI for ATS operations.
 * @namespace geminiService
 */
export const geminiService = {

    /**
     * Extracts text from a PDF/Image and uses Gemini to structure it into a candidate profile.
     * * @param {Buffer} fileBuffer - The binary data of the uploaded file.
     * @param {string} mimeType - The file's MIME type (e.g., 'application/pdf', 'image/jpeg').
     * @returns {Promise<ParsedResumeData>} The structured resume JSON.
     */
    async parseResume(fileBuffer: Buffer, mimeType: string): Promise<ParsedResumeData> {
        try {
            let documentText = "";
            let useGeminiVision = false;

            console.log(`🔍 Routing file processing for type: ${mimeType}`);

            // ROUTE 1: PDFs
            if (mimeType === 'application/pdf') {
                try {
                    // Try the modern Class-based API first
                    if (pdfParse.PDFParse) {
                        const parser = new pdfParse.PDFParse({ data: fileBuffer });
                        const result = await parser.getText();
                        documentText = result.text;
                    }
                    // If that doesn't exist, try the legacy Function API
                    else {
                        const extractFunction = pdfParse.default || pdfParse;
                        const pdfData = await extractFunction(fileBuffer);
                        documentText = pdfData.text;
                    }

                    if (documentText.trim().length < 50) {
                        console.log("⚠️ PDF contains almost no text. Switching to Vision OCR...");
                        useGeminiVision = true;
                    } else {
                        console.log(`✅ Text PDF Extracted. Text Length: ${documentText.length} characters`);
                    }
                } catch (pdfError: any) {
                    console.error("⚠️ pdf-parse failed:", pdfError.message || pdfError);
                    console.log("Switching to Gemini Vision OCR fallback...");
                    useGeminiVision = true;
                }
            }
            // ROUTE 2: Images
            else if (mimeType.startsWith('image/')) {
                console.log("📸 Image file detected. Using Gemini Vision OCR...");
                useGeminiVision = true;
            }

            if (!useGeminiVision && (!documentText || documentText.trim() === "")) {
                throw new Error("Failed to extract any text from the document.");
            }

            let promptParts: any[] = [];

            if (useGeminiVision) {
                promptParts = [
                    RESUME_PROMPT_INSTRUCTION,
                    {
                        inlineData: {
                            data: fileBuffer.toString("base64"),
                            mimeType: mimeType
                        }
                    }
                ];
            } else {
                promptParts = [
                    RESUME_PROMPT_INSTRUCTION + `\n\nDOCUMENT TEXT:\n"""\n${documentText}\n"""`
                ];
            }

            console.log("🧠 Sending request to Gemini Resume Model...");
            const result = await resumeModel.generateContent(promptParts);
            return JSON.parse(result.response.text());

        } catch (error) {
            console.error('Gemini AI Resume Parsing Error:', error);
            throw new Error('Failed to parse the resume using AI.');
        }
    },

    /**
     * Evaluates a list of candidates against a specific job offer.
     * * @param {string} jobOfferText - The text description of the job.
     * @param {any[]} candidates - The array of candidate profiles from MongoDB.
     * @returns {Promise<MatchResult[]>} The scored array of candidates.
     */
    async evaluateCandidates(jobOfferText: string, candidates: any[]): Promise<MatchResult[]> {
        try {
            if (!candidates || candidates.length === 0) return [];

            // Strip down candidate payload to save tokens
            const candidatesToEvaluate = candidates.map(c => ({
                resumeId: c._id || c.id,
                yearsOfExperience: c.yearsOfExperience,
                skills: c.skills,
                tags: c.tags,
                summary: c.summary,
                experienceHistory: c.experiences.map((e: any) => `${e.position} at ${e.company} (${e.startDate} - ${e.endDate})`).join(' | ')
            }));

            const prompt = buildJobMatchPrompt(jobOfferText, candidatesToEvaluate);

            console.log(`🧠 Sending ${candidates.length} candidates to Gemini Match Model...`);
            const result = await matchModel.generateContent([prompt]);

            const matchResults: MatchResult[] = JSON.parse(result.response.text());

            // Sort results highest to lowest score
            return matchResults.sort((a, b) => b.scores.overallScore - a.scores.overallScore);

        } catch (error) {
            console.error('Gemini AI Matching Error:', error);
            throw new Error('Failed to evaluate candidates using AI.');
        }
    }
};