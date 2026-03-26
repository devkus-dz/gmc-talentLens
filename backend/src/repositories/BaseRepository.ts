import { Model, Document } from 'mongoose';
import type { QueryFilter, UpdateQuery } from 'mongoose';


/**
 * Interface representing the standardized paginated response.
 * @template T - The Mongoose Document type.
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  // --- CRUD OPERATIONS ---

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async findOne(filter: QueryFilter<T>): Promise<T | null> {
    return await this.model.findOne(filter);
  }

  async findAll(filter: QueryFilter<T> = {}): Promise<T[]> {
    return await this.model.find(filter);
  }

  async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id);
  }

  /**
     * Retrieves a paginated list of documents.
     * * @param {QueryFilter<T>} filter - MongoDB query filter (e.g., { isActive: true }).
     * @param {number} page - The current page number (1-indexed).
     * @param {number} limit - The number of items per page.
     * @param {any} sort - Sorting criteria (default: newest first).
     * @param {string | any} populate - Optional fields to populate.
     * @returns {Promise<PaginatedResult<T>>} An object containing the data and pagination metadata.
     */
  async findPaginated(
    filter: QueryFilter<T> = {},
    page: number = 1,
    limit: number = 10,
    sort: any = { createdAt: -1 },
    populate?: string | any
  ): Promise<PaginatedResult<T>> {
    // Calculate how many documents to skip
    const skip = (page - 1) * limit;

    // Build the query
    let query = this.model.find(filter).sort(sort).skip(skip).limit(limit);

    // Apply population if provided
    if (populate) {
      query = query.populate(populate);
    }

    // Execute the query and count total documents in parallel for performance
    const [data, total] = await Promise.all([
      query.exec(),
      this.model.countDocuments(filter).exec()
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
}