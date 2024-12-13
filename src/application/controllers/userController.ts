import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { validateRequest } from '../../infrastructure/server/express/middleware/ValidationMiddleware';
import {
  registerValidation,
  loginValidation,
} from '../validations/userValidation';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async register(req: Request, res: Response) {
    const userData = await this.userService.register(req.body);
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: userData._id,
        username: userData.username,
        email: userData.email,
      },
    });
  }

  async login(req: Request, res: Response) {
    const { user, token } = await this.userService.login(req.body);
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  }
}
