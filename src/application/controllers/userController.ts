import { Request, Response } from 'express';
import { UserService } from '../services/userService';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // En UserController
  async register(req: Request, res: Response) {
    const { user, token } = await this.userService.register(req.body);
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
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

  async getAll(req: Request, res: Response) {
    const users = await this.userService.getAll();
    res.json(users);
  }
}
