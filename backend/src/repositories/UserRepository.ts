import { BaseRepository } from './BaseRepository';
import UserModel, { IUser } from '../models/User';

class UserRepository extends BaseRepository<IUser> {
  constructor() {
    // inheriting crud functions from BaseRepository
    super(UserModel);
  }

  // --- Adding more operations ---

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.model.findOne({ email });
  }

  async findRecruiters(): Promise<IUser[]> {
    return await this.model.find({ role: 'RECRUITER' });
  }
}

// exporting (Singleton) for User
export const userRepository = new UserRepository();