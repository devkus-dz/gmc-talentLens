// src/services/geminiService.ts
import { GoogleGenerativeAI, SchemaType, Schema } from '@google/generative-ai';
import dotenv from 'dotenv';
// @ts-ignore
const pdfParse = require('pdf-parse');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

/**
 * 1. STRICT SCHEMA DEFINITION
 */
const resumeSchema: Schema = {
    type: SchemaType.OBJECT,
    properties: {
        firstName: { type: SchemaType.STRING, description: "Candidate's first name", nullable: true },
        lastName: { type: SchemaType.STRING, description: "Candidate's last name", nullable: true },
        email: { type: SchemaType.STRING, description: "Email address", nullable: true },
        phone: { type: SchemaType.STRING, description: "Phone number", nullable: true },
        skills: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "List of technical and soft skills"
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
        }
    }
};

const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
        temperature: 0.0,
        responseMimeType: 'application/json',
        responseSchema: resumeSchema,
    }
});

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

export interface ParsedResumeData {
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
}

export const geminiService = {
    async parseResume(fileBuffer: Buffer, mimeType: string): Promise<ParsedResumeData> {
        try {
            let documentText = "";
            let useGeminiVision = false;

            console.log(`🔍 Routing file processing for type: ${mimeType}`);

            // -------------------------------------------------------------
            // ROUTE 1: Standard PDFs (Try text extraction first)
            // -------------------------------------------------------------
            if (mimeType === 'application/pdf') {
                try {
                    // Universal API Adapter for pdf-parse
                    if (typeof pdfParse === 'function' || typeof pdfParse.default === 'function') {
                        const parsePdfFunction = typeof pdfParse === 'function' ? pdfParse : pdfParse.default;
                        const pdfData = await parsePdfFunction(fileBuffer);
                        documentText = pdfData.text;
                    } else if (pdfParse.PDFParse) {
                        const parser = new pdfParse.PDFParse({ data: fileBuffer });
                        const result = await parser.getText();
                        documentText = result.text;
                    }

                    // THE OCR TRIGGER: If it's a scanned PDF, the text length will be near 0
                    if (documentText.trim().length < 50) {
                        console.log("⚠️ PDF contains almost no text. It must be a scanned document. Switching to Vision OCR...");
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
            // -------------------------------------------------------------
            // ROUTE 2: Direct Images
            // -------------------------------------------------------------
            else if (mimeType.startsWith('image/')) {
                console.log("📸 Image file detected. Using Gemini Vision OCR...");
                useGeminiVision = true;
            }

            // Guard against completely unreadable files
            if (!useGeminiVision && (!documentText || documentText.trim() === "")) {
                throw new Error("Failed to extract any text from the document.");
            }

            // -------------------------------------------------------------
            // BUILDING THE AI REQUEST
            // -------------------------------------------------------------
            const promptInstruction = `
            You are a strict, highly precise data extraction system. Your job is to extract information from the provided document and format it according to the requested schema.
    
            CRITICAL RULES:
            1. NO HALLUCINATION: You must only extract data explicitly written in the document. 
               (EXCEPTIONS: You are required to generate the 'tags', 'summary', and 'locale' fields).
            2. PRESERVE ORIGINAL LANGUAGE (DO NOT TRANSLATE): You MUST extract all text (experiences, education, skills, names) in the EXACT original language of the document. If the document is in Arabic, the output text must be in Arabic. If French, output in French. 
            3. DETECT LOCALE: Identify the primary language of the document and output its 2-letter ISO code (e.g., 'en', 'fr', 'ar') in the 'locale' field.
            4. MANDATORY SUMMARY: If the document does not contain an explicit professional summary or objective, you MUST write a highly professional 2-sentence summary summarizing their overall profile, years of experience, and core expertise. Write this summary in the original language of the CV.
            5. EXTRACT EVERYTHING: Read the entire text (or visually analyze the image) to extract the full work and education history exactly as written.
            6. TAG GENERATION: Generate 5 to 7 high-level tags categorizing their professional field, industry, and seniority (Tags should ideally be in English for database consistency, but the rest of the CV must remain in its original language).
          `;

            let promptParts: any[] = [];

            if (useGeminiVision) {
                // MULTIMODAL MODE: Send the prompt + the raw binary image/pdf
                promptParts = [
                    promptInstruction,
                    {
                        inlineData: {
                            data: fileBuffer.toString("base64"),
                            mimeType: mimeType
                        }
                    }
                ];
            } else {
                // TEXT MODE: Send the prompt + the extracted text string
                promptParts = [
                    promptInstruction + `\n\nDOCUMENT TEXT:\n"""\n${documentText}\n"""`
                ];
            }

            console.log("🧠 Sending request to Gemini...");
            const result = await model.generateContent(promptParts);
            const responseText = result.response.text();

            console.log("🤖 Raw Gemini Response Received.");

            const parsedData: ParsedResumeData = JSON.parse(responseText);
            return parsedData;

        } catch (error) {
            console.error('Gemini AI Parsing Error:', error);
            throw new Error('Failed to parse the resume using AI.');
        }
    }
};