import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Middleware to validate the Request Body against a Zod schema.
 * Uses safeParse to avoid TypeScript try/catch typing issues.
 * @param schema The Zod schema to validate against.
 */
export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {

        // Use safeParse instead of try/catch
        const result = schema.safeParse(req.body);

        if (!result.success) {
            // result.error is natively typed as a ZodError here
            const formattedErrors = result.error.issues.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));

            res.status(400).json({
                message: 'Validation failed',
                errors: formattedErrors
            });
            return;
        }

        // If successful, overwrite req.body with the sanitized/parsed data
        req.body = result.data;
        next();
    };
};