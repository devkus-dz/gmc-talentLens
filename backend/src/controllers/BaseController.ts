import { Request, Response } from 'express';
import { BaseRepository } from '../repositories/BaseRepository';
import { Document } from 'mongoose';

/**
 * Generic Base Controller providing standard CRUD operations.
 * Uses arrow functions to preserve the 'this' context when passed to Express routers.
 * @template T - The Mongoose Document type.
 */
export class BaseController<T extends Document> {
    protected repository: BaseRepository<T>;

    constructor(repository: BaseRepository<T>) {
        this.repository = repository;
    }

    /**
     * Retrieves a paginated list of all documents.
     */
    getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await this.repository.findPaginated({}, page, limit);
            res.status(200).json(result);
        } catch (error) {
            console.error('GetAll Error:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    };

    /**
     * Retrieves a single document by its ID.
     */
    getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const doc = await this.repository.findById(id as string);

            if (!doc) {
                res.status(404).json({ message: 'Resource not found.' });
                return;
            }

            res.status(200).json(doc);
        } catch (error) {
            console.error('GetById Error:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    };

    /**
     * Creates a new document.
     */
    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const newDoc = await this.repository.create(req.body);
            res.status(201).json(newDoc);
        } catch (error) {
            console.error('Create Error:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    };

    /**
     * Updates an existing document by its ID.
     */
    update = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const updatedDoc = await this.repository.update(id as string, req.body);

            if (!updatedDoc) {
                res.status(404).json({ message: 'Resource not found.' });
                return;
            }

            res.status(200).json({ message: 'Resource updated.', data: updatedDoc });
        } catch (error) {
            console.error('Update Error:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    };

    /**
     * Deletes a document by its ID.
     */
    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const deletedDoc = await this.repository.delete(id as string);

            if (!deletedDoc) {
                res.status(404).json({ message: 'Resource not found.' });
                return;
            }

            res.status(200).json({ message: 'Resource deleted successfully.' });
        } catch (error) {
            console.error('Delete Error:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    };
}