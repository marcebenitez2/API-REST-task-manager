import { Router } from 'express';
import { ProjectController } from '../../../../application/controllers/projectController';
import { authenticateToken } from '../middleware/AuthMiddleware';
import { validateRequest } from '../middleware/ValidationMiddleware';
import { createProjectValidation } from '../../../../application/validations/projectValidation';

const router = Router();
const projectController = new ProjectController();

// Ruta para crear un proyecto
router.post(
  '/',
  authenticateToken,
  validateRequest(createProjectValidation),
  (req, res, next) => projectController.createProject(req, res).catch(next)
);

// Ruta para obtener todos los proyectos
router.get('/all', authenticateToken, (req, res, next) =>
  projectController.getProjects(req, res).catch(next)
);

// Ruta para obtener los proyectos de un usuario
router.get('/', authenticateToken, (req, res, next) =>
  projectController.getProjects(req, res).catch(next)
);

// Ruta para obtener un proyecto por su ID
router.get('/:id', authenticateToken, (req, res, next) =>
  projectController.getProject(req, res).catch(next)
);

// Ruta para actualizar un proyecto
router.put(
  '/:id',
  authenticateToken,
  validateRequest(createProjectValidation),
  (req, res, next) => projectController.updateProject(req, res).catch(next)
);

// Ruta para eliminar un proyecto
router.delete('/:id', authenticateToken, (req, res, next) =>
  projectController.deleteProject(req, res).catch(next)
);

// Ruta para agregar un miembro a un proyecto
router.post('/:projectId/members', authenticateToken, (req, res, next) =>
  projectController.addMember(req, res).catch(next)
);

// Ruta para eliminar un miembro de un proyecto
router.delete(
  '/:projectId/members/:userId',
  authenticateToken,
  (req, res, next) => projectController.removeMember(req, res).catch(next)
);

export default router;
/**
 * @openapi
 * /projects:
 *  post:
 *    summary: "Create a new project"
 *    description: "Creates a new project in the system for the authenticated user."
 *    operationId: "createProject"
 *    tags:
 *      - Projects
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              description:
 *                type: string
 *            required:
 *              - name
 *    responses:
 *      201:
 *        description: "Project created successfully."
 *      400:
 *        description: "Invalid request data."
 *      401:
 *        description: "Unauthorized. JWT token is missing or invalid."
 */




/**
 * @openapi
 * /projects/all:
 *  get:
 *    summary: "Get all projects"
 *    description: "Returns a list of all projects in the system. Requires authentication."
 *    operationId: "getAllProjects"
 *    tags:
 *      - Projects
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: "List of all projects returned successfully."
 *      401:
 *        description: "Unauthorized. JWT token is missing or invalid."
 */


/**
 * @openapi
 * /projects:
 *  get:
 *    summary: "Get projects for the authenticated user"
 *    description: "Returns a list of projects owned by or shared with the authenticated user."
 *    operationId: "getUserProjects"
 *    tags:
 *      - Projects
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: "List of user-specific projects returned successfully."
 *      401:
 *        description: "Unauthorized. JWT token is missing or invalid."
 */

/**
 * @openapi
 * /projects/{id}:
 *  get:
 *    summary: "Get a specific project"
 *    description: "Returns the details of a specific project by its ID."
 *    operationId: "getProjectById"
 *    tags:
 *      - Projects
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: "The ID of the project to retrieve."
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: "Project details returned successfully."
 *      404:
 *        description: "Project not found."
 *      401:
 *        description: "Unauthorized. JWT token is missing or invalid."
 */


/**
 * @openapi
 * /projects/{id}:
 *  put:
 *    summary: "Update a project"
 *    description: "Updates the details of an existing project by its ID."
 *    operationId: "updateProject"
 *    tags:
 *      - Projects
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: "The ID of the project to update."
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              description:
 *                type: string
 *    responses:
 *      200:
 *        description: "Project updated successfully."
 *      400:
 *        description: "Invalid request data."
 *      404:
 *        description: "Project not found."
 *      401:
 *        description: "Unauthorized. JWT token is missing or invalid."
 */

/**
 * @openapi
 * /projects/{id}:
 *  delete:
 *    summary: "Delete a project"
 *    description: "Deletes an existing project by its ID."
 *    operationId: "deleteProject"
 *    tags:
 *      - Projects
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: "The ID of the project to delete."
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: "Project deleted successfully."
 *      404:
 *        description: "Project not found."
 *      401:
 *        description: "Unauthorized. JWT token is missing or invalid."
 */

/**
 * @openapi
 * /projects/{projectId}/members:
 *  post:
 *    summary: "Add a member to a project"
 *    description: "Adds a new member to an existing project."
 *    operationId: "addMemberToProject"
 *    tags:
 *      - Projects
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: projectId
 *        required: true
 *        description: "The ID of the project to add a member to."
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
 *            required:
 *              - userId
 *    responses:
 *      200:
 *        description: "Member added successfully."
 *      404:
 *        description: "Project not found."
 *      401:
 *        description: "Unauthorized. JWT token is missing or invalid."
 */

/**
 * @openapi
 * /projects/{projectId}/members/{userId}:
 *  delete:
 *    summary: "Remove a member from a project"
 *    description: "Removes a member from an existing project."
 *    operationId: "removeMemberFromProject"
 *    tags:
 *      - Projects
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: projectId
 *        required: true
 *        description: "The ID of the project to remove a member from."
 *        schema:
 *          type: string
 *      - in: path
 *        name: userId
 *        required: true
 *        description: "The ID of the user to remove from the project."
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: "Member removed successfully."
 *      404:
 *        description: "Project or user not found."
 *      401:
 *        description: "Unauthorized. JWT token is missing or invalid."
 */