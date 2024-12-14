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

// Ruta para crear una tarea
router.post(
  '/',
  authenticateToken,
  validateRequest(createTaskValidation),
  (req, res, next) => taskController.createTask(req, res).catch(next)
);

// Ruta para traer las tareas asignadas al usuario autenticado
router.get('/', authenticateToken, (req, res, next) =>
  taskController.getTasks(req, res).catch(next)
);

// Ruta para traer todas las tareas
router.get('/all', authenticateToken, (req, res, next) =>
  taskController.getAllTasks(req, res).catch(next)
);

// Ruta para traer tareas de un proyecto específico
router.get('/project/:projectId', authenticateToken, (req, res, next) =>
  taskController.getTasksByProject(req, res).catch(next)
);

// Ruta para actualizar una tarea
router.put(
  '/:id',
  authenticateToken,
  validateRequest(updateTaskValidation),
  (req, res, next) => taskController.updateTask(req, res).catch(next)
);

// Ruta para eliminar una tarea
router.delete('/:id', authenticateToken, (req, res, next) =>
  taskController.deleteTask(req, res).catch(next)
);

// Ruta para asignar una tarea a un usuario
router.post('/:taskId/assign', authenticateToken, async (req, res, next) => {
  try {
    await taskController.assignTask(req, res, next);
  } catch (error) {
    next(error);
  }
});

//Ruta para sacar a alguien que estaba asignado a una tarea
router.post('/:taskId/unassign', authenticateToken, async (req, res, next) => {
  try {
    await taskController.unassignTask(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Ruta para buscar tareas por título o descripción
router.get('/search', authenticateToken, (req, res, next) =>
  taskController.searchTasks(req, res, next).catch(next)
);

// Ruta para traer tareas por estado
router.get('/status/:status', authenticateToken, (req, res, next) =>
  taskController.getTasksByStatus(req, res).catch(next)
);

export default router;

/**
 * @openapi
 * /tasks:
 *  post:
 *    summary: "Create a new task"
 *    description: "Creates a new task and assigns it to a project. The task can now be assigned to multiple users."
 *    operationId: "createTask"
 *    tags:
 *      - Tasks
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              description:
 *                type: string
 *              project:
 *                type: string
 *              assignedTo:
 *                type: array
 *                items:
 *                  type: string
 *                description: "An array of user IDs to assign the task to."
 *              dueDate:
 *                type: string
 *                format: date
 *            required:
 *              - title
 *              - project
 *    responses:
 *      201:
 *        description: "Task created successfully."
 *      400:
 *        description: "Invalid request data."
 *      401:
 *        description: "Unauthorized. JWT token is missing or invalid."
 */

/**
 * @openapi
 * /tasks/{taskId}/unassign:
 *  post:
 *    summary: "Unassign user from a task"
 *    description: "Removes a user from the task by unassigning them."
 *    operationId: "unassignUserFromTask"
 *    tags:
 *      - Tasks
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: taskId
 *        required: true
 *        description: "The ID of the task to unassign the user from."
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              userId:
 *                type: string
 *                description: "The user ID to remove from the task."
 *            required:
 *              - userId
 *    responses:
 *      200:
 *        description: "User unassigned successfully."
 *      400:
 *        description: "User ID is required or invalid."
 *      404:
 *        description: "Task or user not found."
 *      401:
 *        description: "Unauthorized. JWT token is missing or invalid."
 */

/**
 * @openapi
 * /tasks:
 *  get:
 *    summary: "Get tasks assigned to the authenticated user"
 *    description: "Returns tasks assigned to the authenticated user."
 *    operationId: "getUserTasks"
 *    tags:
 *      - Tasks
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: "List of tasks assigned to the user returned successfully."
 *      401:
 *        description: "Unauthorized. JWT token is missing or invalid."
 */

/**
 * @openapi
 * /tasks/all:
 *  get:
 *    summary: "Get all tasks"
 *    description: "Returns a list of all tasks in the system."
 *    operationId: "getAllTasks"
 *    tags:
 *      - Tasks
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: "List of all tasks returned successfully."
 *      401:
 *        description: "Unauthorized. JWT token is missing or invalid."
 */

/**
 * @openapi
 * /tasks/project/{projectId}:
 *  get:
 *    summary: "Get tasks by project"
 *    description: "Returns tasks associated with a specific project."
 *    operationId: "getTasksByProject"
 *    tags:
 *      - Tasks
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: projectId
 *        required: true
 *        description: "The ID of the project."
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: "Tasks for the specified project returned successfully."
 *      404:
 *        description: "Project not found."
 *      401:
 *        description: "Unauthorized. JWT token is missing or invalid."
 */

/**
 * @openapi
 * /tasks/{id}:
 *  put:
 *    summary: "Update a task"
 *    description: "Updates details of an existing task."
 *    operationId: "updateTask"
 *    tags:
 *      - Tasks
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: "The ID of the task to update."
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              description:
 *                type: string
 *              status:
 *                type: string
 *              dueDate:
 *                type: string
 *                format: date
 *    responses:
 *      200:
 *        description: "Task updated successfully."
 *      400:
 *        description: "Invalid request data."
 *      404:
 *        description: "Task not found."
 *      401:
 *        description: "Unauthorized. JWT token is missing or invalid."
 */

/**
 * @openapi
 * /tasks/{id}:
 *  delete:
 *    summary: "Delete a task"
 *    description: "Deletes a task by its ID."
 *    operationId: "deleteTask"
 *    tags:
 *      - Tasks
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: "The ID of the task to delete."
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: "Task deleted successfully."
 *      404:
 *        description: "Task not found."
 *      401:
 *        description: "Unauthorized. JWT token is missing or invalid."
 */

/**
 * @openapi
 * /tasks/{taskId}/assign:
 *  post:
 *    summary: "Assign task to multiple users"
 *    description: "Assigns a specific task to multiple users."
 *    operationId: "assignTaskToUsers"
 *    tags:
 *      - Tasks
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: taskId
 *        required: true
 *        description: "The ID of the task to assign users to."
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              userIds:
 *                type: array
 *                items:
 *                  type: string
 *                description: "An array of user IDs to assign the task to."
 *            required:
 *              - userIds
 *    responses:
 *      200:
 *        description: "Users assigned successfully."
 *      400:
 *        description: "Invalid input data."
 *      404:
 *        description: "Task not found."
 *      401:
 *        description: "Unauthorized. JWT token is missing or invalid."
 */

/**
 * @openapi
 * /tasks/search:
 *  get:
 *    summary: "Search tasks by title or description"
 *    description: "Returns tasks that match the search term in their title or description."
 *    operationId: "searchTasks"
 *    tags:
 *      - Tasks
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: query
 *        name: searchTerm
 *        required: true
 *        description: "The search term to filter tasks."
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: "Matching tasks returned successfully."
 *      400:
 *        description: "Invalid search term."
 *      401:
 *        description: "Unauthorized. JWT token is missing or invalid."
 */

/**
 * @openapi
 * /tasks/status/{status}:
 *  get:
 *    summary: "Get tasks by status"
 *    description: "Returns tasks filtered by their status."
 *    operationId: "getTasksByStatus"
 *    tags:
 *      - Tasks
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: status
 *        required: true
 *        description: "The status of the tasks to retrieve."
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: "Tasks with the specified status returned successfully."
 *      400:
 *        description: "Invalid status provided."
 *      401:
 *        description: "Unauthorized. JWT token is missing or invalid."
 */
