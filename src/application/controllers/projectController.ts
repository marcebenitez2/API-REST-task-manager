import { Request, Response } from 'express';
import { ProjectService } from '../services/projectService';
import {
  createProjectValidation,
  updateProjectValidation,
} from '../validations/projectValidation';

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  // Crear nuevo proyecto
  async createProject(req: Request, res: Response) {
    // Asumiendo que req.user.id viene del middleware de autenticación
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

  // Obtener TODOS los proyectos
  async getProjectsAll(req: Request, res: Response) {
    const projects = await this.projectService.getProjectsAll();
    res.json(projects);
  }

  // Obtener todos los proyectos de un usuario
  async getProjects(req: Request, res: Response) {
    const projects = await this.projectService.getProjectsByUser(req.user!.id);
    res.json(projects);
  }

  // Obtener un solo proyecto
  async getProject(req: Request, res: Response) {
    const { id } = req.params;
    const project = await this.projectService.getProjectById(id);

    res.json(project);
  }

  // Actualizar un proyecto
  async updateProject(req: Request, res: Response) {
    const { id } = req.params;
    const updatedProject = await this.projectService.updateProject(
      id,
      req.body
    );

    res.json({
      message: 'Project updated successfully',
      project: updatedProject,
    });
  }

  // Eliminar un proyecto
  async deleteProject(req: Request, res: Response) {
    const { id } = req.params;
    await this.projectService.deleteProject(id);

    res.json({ message: 'Project deleted successfully' });
  }

  // Agregar un miembro a un proyecto
  async addMember(req: Request, res: Response) {
    const { projectId } = req.params;
    const { userId } = req.body;

    const updatedProject = await this.projectService.addMemberToProject(
      projectId,
      userId
    );

    res.json({
      message: 'Member added successfully',
      project: updatedProject,
    });
  }

  // Eliminar un miembro de un proyecto
  async removeMember(req: Request, res: Response) {
    const { projectId, userId } = req.params;

    const updatedProject = await this.projectService.removeMemberFromProject(
      projectId,
      userId
    );

    res.json({
      message: 'Member removed successfully',
      project: updatedProject,
    });
  }
}
