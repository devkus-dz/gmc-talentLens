import { Model, Document } from 'mongoose';
// On importe les types spécifiques de Mongoose v9
import type { QueryFilter, UpdateQuery } from 'mongoose';

export class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  // --- OPÉRATIONS CRUD GLOBALES ---

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  // Utilisation du nouveau type "QueryFilter"
  async findOne(filter: QueryFilter<T>): Promise<T | null> {
    return await this.model.findOne(filter);
  }

  async findAll(filter: QueryFilter<T> = {}): Promise<T[]> {
    return await this.model.find(filter);
  }

  async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    // { new: true } retourne le document mis à jour
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id);
  }
}