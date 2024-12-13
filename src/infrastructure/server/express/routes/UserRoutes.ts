import { Router } from 'express';
import { UserController } from '../../../../application/controllers/userController';
import { validateRequest } from '../middleware/ValidationMiddleware';
import { authenticateToken } from '../middleware/AuthMiddleware';
import {
  loginValidation,
  registerValidation,
} from '../../../../application/validations/userValidation';

const router = Router();
const userController = new UserController();

// Ruta para registrar un usuario
router.post(
  '/register',
  validateRequest(registerValidation), // Middleware para validar datos del registro
  (req, res, next) => userController.register(req, res).catch(next)
);

// Ruta para inicio de sesión
router.post(
  '/login',
  validateRequest(loginValidation), // Middleware para validar datos del login
  (req, res, next) => userController.login(req, res).catch(next)
);

// Ruta protegida: obtener perfil del usuario autenticado
router.get(
  '/profile',
  authenticateToken, // Middleware para validar JWT
  (req, res) => {
    res.json({
      message: 'Perfil del usuario autenticado',
      user: req.user, // Información del usuario añadida por el authMiddleware
    });
  }
);

// Ruta para cerrar sesión
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    message: 'Simulation of session closing completed.',
  });
});

export default router;
