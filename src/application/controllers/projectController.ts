import { Request, Response } from 'express';
import { ProjectService } from '../services/projectService';

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  async createProject(req: Request, res: Response) {
    const projectData = {
      ...req.body,
      owner: req.user!.id,
    };

    const project = await this.projectService.createProject(projectData);

    res.status(201).json({
      message: 'Project created successfully',
      project,
    });
  }

  // Obtener TODOS los proyectos (con cache)
  async getProjectsAll(req: Request, res: Response) {
    const projects = await this.projectService.getProjectsAll(); // El servicio maneja la cache
    res.json(projects);
  }

  // Obtener todos los proyectos de un usuario (con cache)
  async getProjects(req: Request, res: Response) {
    const projects = await this.projectService.getProjectsByUser(req.user!.id); // El servicio maneja la cache
    res.json(projects);
  }

  // Obtener un solo proyecto (se puede cachear si es necesario)
  async getProject(req: Request, res: Response) {
    const { id } = req.params;
    const project = await this.projectService.getProjectById(id);

    res.json(project);
  }

  // Actualizar un proyecto (no necesariamente requiere cache)
  async updateProject(req: Request, res: Response) {
    const { id } = req.params;
    const updatedProject = await this.projectService.updateProject(
      id,
      req.body
    );

    // Limpiar cache si el proyecto fue actualizado (esto depende de tu lógica)
    // cache.del('allProjects'); // o el cache específico que desees limpiar

    res.json({
      message: 'Project updated successfully',
      project: updatedProject,
    });
  }

  // Eliminar un proyecto (limpiar caché también)
  async deleteProject(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const result = await this.projectService.deleteProjectAndTasks(id);

      // Limpiar el cache correspondiente
      // cache.del('allProjects'); // Si deseas limpiar el cache de proyectos generales

      res.json(result);
    } catch (error) {
      res.status(500).json({ message: (error as any).message });
    }
  }

  // Agregar un miembro a un proyecto (limpiar caché si es necesario)
  async addMember(req: Request, res: Response) {
    const { projectId } = req.params;
    const { userId } = req.body;

    const updatedProject = await this.projectService.addMemberToProject(
      projectId,
      userId
    );

    // Limpiar el cache si es necesario, por ejemplo si los miembros del proyecto se actualizan
    // cache.del(`projectsByUser:${req.user!.id}`);

    res.json({
      message: 'Member added successfully',
      project: updatedProject,
    });
  }

  // Eliminar un miembro de un proyecto (limpiar caché si es necesario)
  async removeMember(req: Request, res: Response) {
    const { projectId, userId } = req.params;

    const updatedProject = await this.projectService.removeMemberFromProject(
      projectId,
      userId
    );

    // Limpiar el cache si es necesario
    // cache.del(`projectsByUser:${req.user!.id}`);

    res.json({
      message: 'Member removed successfully',
      project: updatedProject,
    });
  }
}
