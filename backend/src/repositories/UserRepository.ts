// backend/src/repositories/UserRepository.ts
import { BaseRepository } from './BaseRepository';
import UserModel, { IUser } from '../models/User';

class UserRepository extends BaseRepository<IUser> {
  constructor() {
    // On passe le modèle Mongoose User au parent
    super(UserModel);
  }

  // --- OPÉRATIONS SPÉCIFIQUES À L'UTILISATEUR ---

  // Exemple d'une fonction que seul le User possède
  async findByEmail(email: string): Promise<IUser | null> {
    return await this.model.findOne({ email });
  }

  async findRecruiters(): Promise<IUser[]> {
    return await this.model.find({ role: 'RECRUITER' });
  }
}

// On exporte une instance unique (Singleton) pour l'utiliser partout
export const userRepository = new UserRepository();