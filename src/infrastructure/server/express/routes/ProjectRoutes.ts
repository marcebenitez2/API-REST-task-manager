import { Router } from 'express';
import { ProjectController } from '../../../../application/controllers/projectController';
import { authenticateToken } from '../middleware/AuthMiddleware';
import { validateRequest } from '../middleware/ValidationMiddleware';
import { createProjectValidation } from '../../../../application/validations/projectValidation';

const router = Router();
const projectController = new ProjectController();

// Crear nuevo proyecto
router.post(
  '/',
  authenticateToken, // Middleware para verificar el token JWT
  validateRequest(createProjectValidation), // Middleware para validar los datos del proyecto
  (req, res, next) => projectController.createProject(req, res).catch(next)
);

// Obtener TODOS los proyectos
router.get('/all', authenticateToken, (req, res, next) =>
  projectController.getProjects(req, res).catch(next)
);

// Obtener todos los proyectos de un usuario
router.get('/', authenticateToken, (req, res, next) =>
  projectController.getProjects(req, res).catch(next)
);

//Obtener un solo proyecto
router.get('/:id', authenticateToken, (req, res, next) =>
  projectController.getProject(req, res).catch(next)
);

// Actualizar un proyecto
router.put(
  '/:id',
  authenticateToken,
  validateRequest(createProjectValidation),
  (req, res, next) => projectController.updateProject(req, res).catch(next)
);

// Eliminar un proyecto
router.delete('/:id', authenticateToken, (req, res, next) =>
  projectController.deleteProject(req, res).catch(next)
);

// Agregar un miembro a un proyecto
router.post('/:projectId/members', authenticateToken, (req, res, next) =>
  projectController.addMember(req, res).catch(next)
);

// Eliminar un miembro de un proyecto
router.delete(
  '/:projectId/members/:userId',
  authenticateToken,
  (req, res, next) => projectController.removeMember(req, res).catch(next)
);

export default router;
