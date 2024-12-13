import { UserRepository } from '../../domain/repositories/UserRepository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/environment';
import { CustomError } from '../../infrastructure/server/express/middleware/ErrorHandlingMiddleware';
import { IUser } from '../../domain/models/user';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(userData: {
    username: string,
    email: string,
    password: string
  }): Promise<IUser> {
    // Verificar si el usuario o email ya existen
    const existingUsername = await this.userRepository.findByUsername(userData.username);
    const existingEmail = await this.userRepository.findByEmail(userData.email);

    if (existingUsername) {
      throw new CustomError('Username already exists', 400);
    }

    if (existingEmail) {
      throw new CustomError('Email already exists', 400);
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Crear usuario
    return this.userRepository.create({
      ...userData,
      password: hashedPassword
    });
  }

  async login(credentials: {
    email: string,
    password: string
  }): Promise<{ user: IUser, token: string }> {
    const user = await this.userRepository.findByEmail(credentials.email);

    if (!user) {
      throw new CustomError('Invalid credentials', 401);
    }

    const isMatch = await bcrypt.compare(credentials.password, user.password);

    if (!isMatch) {
      throw new CustomError('Invalid credentials', 401);
    }

    // Generar token
    const token = jwt.sign(
      { id: user._id },
      env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return { user, token };
  }
}