import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Company from '../models/Company';
import { s3Service } from '../services/s3Service';

class AdminController {

    /**
     * @route POST /api/admin/provision-client
     * @description Admin creates a new Company and provisions its first Recruiter account simultaneously.
     * @access Private (ADMIN)
     */
    provisionB2BClient = async (req: Request | any, res: Response): Promise<void> => {
        try {
            const { companyName, website, industry, description, location, firstName, lastName, email, password } = req.body;

            if (!companyName || !email || !password || !firstName || !lastName) {
                res.status(400).json({ message: 'Please provide all required fields.' });
                return;
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                res.status(400).json({ message: 'A user with this email already exists.' });
                return;
            }

            // FIX 1: Explicitly type as string | undefined (not null)
            let logoUrl: string | undefined = undefined;

            if (req.file) {
                const fileKey = await s3Service.uploadCompanyLogo(req.file.buffer, req.file.originalname, req.file.mimetype);
                logoUrl = `${process.env.S3_ENDPOINT || 'http://localhost:9000'}/${process.env.S3_BUCKET_NAME || 'talentlens-storage'}/${fileKey}`;
            }

            // FIX 2: Use `new Model()` + `.save()` for perfect TypeScript inference
            const newCompany = new Company({
                name: companyName,
                website: website || '',
                industry: industry || '',
                description: description || '',
                location: location || '',
                logoUrl: logoUrl // Now perfectly accepts string | undefined
            });
            await newCompany.save();

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // newCompany._id is now perfectly recognized by TypeScript
            const newRecruiter = new User({
                firstName,
                lastName,
                email,
                passwordHash: hashedPassword,
                role: 'RECRUITER',
                companyId: newCompany._id
            });
            await newRecruiter.save();

            res.status(201).json({ message: 'Provisioned successfully.', company: newCompany });
        } catch (error) {
            console.error("Provisioning Error:", error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    };

    /**
     * @route GET /api/admin/companies
     * @description Fetch all onboarded companies
     */
    getAllCompanies = async (req: Request, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;
            const search = req.query.search as string;

            const query: any = {};
            if (search) {
                // Search by Company Name or Industry
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { industry: { $regex: search, $options: 'i' } }
                ];
            }

            const companies = await Company.find(query)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const total = await Company.countDocuments(query);

            res.status(200).json({
                data: companies,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            });
        } catch (error) {
            console.error('Fetch Companies Error:', error);
            res.status(500).json({ message: 'Failed to fetch companies' });
        }
    };

    // --- UPDATE ---
    updateCompany = async (req: Request | any, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const updateData: any = { ...req.body };

            if (req.file) {
                const company = await Company.findById(id);
                if (company?.logoUrl) {
                    const match = company.logoUrl.match(/(company-images\/[^?]+)/);
                    if (match && match[1]) await s3Service.deleteFile(match[1]);
                }
                const fileKey = await s3Service.uploadCompanyLogo(req.file.buffer, req.file.originalname, req.file.mimetype);
                updateData.logoUrl = `${process.env.S3_ENDPOINT || 'http://localhost:9000'}/${process.env.S3_BUCKET_NAME || 'talentlens-storage'}/${fileKey}`;
            }

            Object.keys(updateData).forEach(key => {
                if (updateData[key] === null || updateData[key] === "null") {
                    updateData[key] = undefined;
                }
            });

            // FIXED: Replaced { new: true } with { returnDocument: 'after', runValidators: true }
            const updatedCompany = await Company.findByIdAndUpdate(id, updateData, {
                returnDocument: 'after',
                runValidators: true
            });

            if (!updatedCompany) {
                res.status(404).json({ message: 'Company not found' });
                return;
            }

            res.status(200).json({ message: 'Updated successfully', data: updatedCompany });
        } catch (error) {
            console.error("Update Company Error:", error);
            res.status(500).json({ message: 'Failed to update company' });
        }
    };

    // --- DELETE ---
    deleteCompany = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            const deletedCompany = await Company.findByIdAndDelete(id);

            if (!deletedCompany) {
                res.status(404).json({ message: 'Company not found' });
                return;
            }

            res.status(200).json({ message: 'Company deleted successfully' });
        } catch (error) {
            console.error('Delete Company Error:', error);
            res.status(500).json({ message: 'Failed to delete company' });
        }
    };
}

export const adminController = new AdminController();