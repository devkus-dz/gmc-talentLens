import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Company from '../models/Company';

class AdminController {

    /**
     * @route POST /api/admin/provision-client
     * @description Admin creates a new Company and provisions its first Recruiter account simultaneously.
     * @access Private (ADMIN)
     */
    provisionB2BClient = async (req: Request, res: Response): Promise<void> => {
        try {
            const {
                companyName, website, industry, description, location, // Company Info
                firstName, lastName, email, password // First Recruiter Info
            } = req.body;

            // 1. Validation
            if (!companyName || !email || !password || !firstName || !lastName) {
                res.status(400).json({ message: 'Please provide all required fields for company and recruiter.' });
                return;
            }

            // 2. Check if the recruiter email is already in use
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                res.status(400).json({ message: 'A user with this email already exists.' });
                return;
            }

            // 3. Create the Company Document
            const newCompany = await Company.create({
                name: companyName,
                website: website || '',
                industry: industry || '',
                description: description || '',
                location: location || ''
            });

            // 4. Hash the password provided by the Admin
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // 5. Create the Recruiter User and link them to the new Company
            const newRecruiter = await User.create({
                firstName,
                lastName,
                email,
                passwordHash: hashedPassword,
                role: 'RECRUITER',
                companyId: newCompany._id
            });

            res.status(201).json({
                message: 'Company and Recruiter provisioned successfully.',
                company: newCompany,
                recruiter: {
                    id: newRecruiter._id,
                    email: newRecruiter.email,
                    role: newRecruiter.role,
                    firstName: newRecruiter.firstName,
                    lastName: newRecruiter.lastName
                }
            });

        } catch (error) {
            console.error('Provision B2B Client Error:', error);
            res.status(500).json({ message: 'Internal server error while provisioning client.' });
        }
    };

    // ... In the future, you can add getPlatformStats, approveJobs, etc. here!
}

export const adminController = new AdminController();