import { Router } from 'express';
import { TaskController } from '../../../../application/controllers/taskController';
import { validateRequest } from '../middleware/ValidationMiddleware';
import { authenticateToken } from '../middleware/AuthMiddleware';
import {
  createTaskValidation,
  updateTaskValidation,
} from '../../../../application/validations/taskValidation';

const router = Router();
const taskController = new TaskController();

// Ruta para crear una nueva tarea
router.post(
  '/',
  authenticateToken,
  validateRequest(createTaskValidation), // Middleware para validar los datos de la tarea
  (req, res, next) => taskController.createTask(req, res).catch(next)
);

// Ruta para obtener tareas asignadas al usuario autenticado
router.get('/', authenticateToken, (req, res, next) =>
  taskController.getTasks(req, res).catch(next)
);

// Ruta para traer TODAS las tareas
router.get('/all', authenticateToken, (req, res, next) =>
  taskController.getAllTasks(req, res).catch(next)
);

// Ruta para obtener tareas de un proyecto específico
router.get('/project/:projectId', authenticateToken, (req, res, next) =>
  taskController.getTasksByProject(req, res).catch(next)
);

// Ruta para actualizar una tarea existente
router.put(
  '/:id',
  authenticateToken,
  validateRequest(updateTaskValidation), // Middleware para validar los datos de actualización
  (req, res, next) => taskController.updateTask(req, res).catch(next)
);

// Ruta para eliminar una tarea
router.delete('/:id', authenticateToken, (req, res, next) =>
  taskController.deleteTask(req, res).catch(next)
);

// Ruta para asignar una tarea a un usuario específico
router.post('/:taskId/assign', authenticateToken, (req, res, next) =>
  taskController.assignTask(req, res).catch(next)
);

// Ruta para buscar tareas por nombre o descripcion
router.get('/search', authenticateToken, (req, res, next) =>
  taskController.searchTasks(req, res, next).catch(next)
);

// Ruta para filtrar por estado de tareas
router.get('/status/:status', authenticateToken, (req, res, next) =>
  taskController.getTasksByStatus(req, res).catch(next)
);

export default router;
