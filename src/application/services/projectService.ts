import { IProject } from '../../domain/models/project';
import { ProjectRepository } from '../../domain/repositories/ProjectRepository';
import { CustomError } from '../../infrastructure/server/express/middleware/ErrorHandlingMiddleware';
import mongoose from 'mongoose';

export class ProjectService {
  private projectRepository: ProjectRepository;

  constructor() {
    this.projectRepository = new ProjectRepository();
  }

  // Crear nuevo proyecto
  async createProject(projectData: {
    name: string;
    description?: string;
    owner: string;
  }): Promise<IProject> {
    return this.projectRepository.create({
      ...projectData,
      owner: new mongoose.Types.ObjectId(projectData.owner),
      members: [], // Inicializar con un arreglo vacío
    });
  }

  // Obtener TODOS los proyectos
  async getProjectsAll(): Promise<IProject[]> {
    return this.projectRepository.findAll();
  }

  // Obtener todos los proyectos de un usuario
  async getProjectsByUser(userId: string): Promise<IProject[]> {
    return this.projectRepository.findProjectsByUser(userId);
  }

  // Obtener un solo proyecto
  async getProjectById(projectId: string): Promise<IProject | null> {
    return this.projectRepository.findById(projectId);
  }

  // Actualizar un proyecto
  async updateProject(
    projectId: string,
    updateData: Partial<IProject>
  ): Promise<IProject | null> {
    // Convertir owner a ObjectId si está presente
    if (updateData.owner && typeof updateData.owner === 'string') {
      updateData.owner = new mongoose.Types.ObjectId(updateData.owner);
    }

    return this.projectRepository.update(projectId, updateData);
  }

  // Eliminar un proyecto
  async deleteProject(projectId: string): Promise<IProject | null> {
    return this.projectRepository.delete(projectId);
  }

  // Agregar un miembro a un proyecto
  async addMemberToProject(
    projectId: string,
    userId: string
  ): Promise<IProject> {
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new CustomError('Project not found', 404);
    }

    const updatedProject = await this.projectRepository.addMember(
      projectId,
      userId
    );

    if (!updatedProject) {
      throw new CustomError('Failed to add member to project', 500);
    }

    return updatedProject;
  }

  // Eliminar un miembro de un proyecto
  async removeMemberFromProject(
    projectId: string,
    userId: string
  ): Promise<IProject> {
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new CustomError('Project not found', 404);
    }

    const updatedProject = await this.projectRepository.removeMember(
      projectId,
      userId
    );

    if (!updatedProject) {
      throw new CustomError('Failed to remove member from project', 500);
    }

    return updatedProject;
  }
}
