import { IUser, User } from '../models/user';
import { GenericRepository } from './GenericRepository';

export class UserRepository extends GenericRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email });
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return this.model.findOne({ username });
  }
}
