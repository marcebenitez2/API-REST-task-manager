// src/application/services/projectService.ts
import { IProject } from '../../domain/models/project';
import { Task } from '../../domain/models/task';
import { ProjectRepository } from '../../domain/repositories/ProjectRepository';
import { CustomError } from '../../infrastructure/server/express/middleware/ErrorHandlingMiddleware';
import mongoose from 'mongoose';
import cache from '../../config/cache'; // Importa la instancia de caché

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
    // const cacheKey = 'allProjects';
    // const cachedProjects = cache.get(cacheKey); // Intenta obtener los proyectos del cache

    // // Si el valor en cache es válido y es un arreglo de proyectos
    // if (Array.isArray(cachedProjects)) {
    //   console.log('Returning cached projects');
    //   return cachedProjects; // Si están en caché, devuelve los datos
    // }

    // Si no están en caché, consulta a la base de datos
    const projects = await this.projectRepository.findAll();

    // Almacena el resultado en caché
    // cache.set(cacheKey, projects);

    return projects;
  }

  // Obtener todos los proyectos de un usuario
  async getProjectsByUser(userId: string): Promise<IProject[]> {
    const cacheKey = `projectsByUser:${userId}`;
    const cachedProjects = cache.get(cacheKey); // Intenta obtener los proyectos del cache

    // Si el valor en cache va y es un arreglo de proyectos
    if (Array.isArray(cachedProjects)) {
      console.log('Returning cached projects for user');
      return cachedProjects;
    }

    // Si no están en caché, consulta a la base de datos
    const projects = await this.projectRepository.findProjectsByUser(userId);

    // Almacena el resultado en caché
    cache.set(cacheKey, projects);

    return projects;
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

  // Eliminar un proyecto y sus tareas asociadas con transacción
  async deleteProjectAndTasks(projectId: string): Promise<IProject | null> {
    try {
      // Eliminar tareas primero
      const deleteResult = await Task.deleteMany({ project: projectId });

      // Luego eliminar proyecto
      const deletedProject = await this.projectRepository.delete(projectId);

      if (!deletedProject) {
        throw new CustomError('Project not found', 404);
      }

      // Limpiar el caché cuando un proyecto es eliminado
      cache.del('allProjects'); // Elimina la caché de todos los proyectos
      cache.del(`projectsByUser:${deletedProject.owner}`); // Elimina la caché del propietario de este proyecto

      return deletedProject;
    } catch (error) {
      throw error;
    }
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

    // Limpiar caché después de agregar un miembro
    cache.del(`projectsByUser:${project.owner}`);

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

    // Limpiar caché después de eliminar un miembro
    cache.del(`projectsByUser:${project.owner}`);

    return updatedProject;
  }
}
