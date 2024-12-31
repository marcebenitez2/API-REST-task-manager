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
  validateRequest(registerValidation), // Middleware to validate registration data
  (req, res, next) => userController.register(req, res).catch(next)
);

// Ruta para iniciar sesión
router.post(
  '/login',
  validateRequest(loginValidation), // Middleware to validate login data
  (req, res, next) => userController.login(req, res).catch(next)
);

// Ruta para obtener el perfil del usuario autenticado
router.get(
  '/profile',
  authenticateToken, // Middleware to validate JWT
  (req, res) => {
    res.json({
      message: 'Authenticated user profile',
      user: req.user, // User information added by the authMiddleware
    });
  }
);

// Ruta para cerrar sesión
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    message: 'Simulation of session closing completed.',
  });
});

// Ruta para traer todos los usuarios
router.get('/all', authenticateToken, (req, res, next) =>
  userController.getAll(req, res).catch(next)
);

export default router;
/**
 * @openapi
 * /users/register:
 *  post:
 *    summary: "Register a new user"
 *    description: "Creates a new user in the api."
 *    operationId: "registerUser"
 *    tags:
 *      - Users
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *            required:
 *              - username
 *              - email
 *              - password
 *    responses:
 *      201:
 *        description: "User created successfully."
 *      400:
 *        description: "Invalid request data, missing required fields or incorrect format."
 */

/**
 * @openapi
 * /users/login:
 *  post:
 *    summary: "Login a user"
 *    description: "Logs in a user by validating their email and password."
 *    operationId: "loginUser"
 *    tags:
 *      - Users
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *            required:
 *              - email
 *              - password
 *    responses:
 *      200:
 *        description: "Login successful. Returns a JWT token for further authentication."
 *      401:
 *        description: "Invalid credentials. Either the email or password is incorrect."
 */

/**
 * @openapi
 * /users/profile:
 *  get:
 *    summary: "Get the authenticated user's profile"
 *    description: "Returns the profile information of the currently authenticated user."
 *    operationId: "getUserProfile"
 *    tags:
 *      - Users
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: "Authenticated user profile returned successfully."
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                user:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: string
 *                    username:
 *                      type: string
 *                    email:
 *                      type: string
 *      401:
 *        description: "Unauthorized access. Invalid or missing JWT."
 */

/**
 * @openapi
 * /users/all:
 *  get:
 *    summary: "Get all users"
 *    description: "Returns a list of all users in the system. Requires authentication."
 *    operationId: "getAllUsers"
 *    tags:
 *      - Users
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: "List of users retrieved successfully."
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                  username:
 *                    type: string
 *                  email:
 *                    type: string
 *      401:
 *        description: "Unauthorized access. Invalid or missing JWT."
 *      500:
 *        description: "Internal server error."
 */
