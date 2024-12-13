import { ITask, TaskStatus } from '../../domain/models/task';
import { TaskRepository } from '../../domain/repositories/TaskRepository';
import mongoose from 'mongoose';

export class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  // Crear una tarea
  async createTask(taskData: {
    title: string;
    description?: string;
    project: string;
    assignedTo?: string;
    dueDate?: Date;
  }): Promise<ITask> {
    return this.taskRepository.create({
      ...taskData,
      project: new mongoose.Types.ObjectId(taskData.project),
      status: TaskStatus.PENDING,
      assignedTo: taskData.assignedTo
        ? new mongoose.Types.ObjectId(taskData.assignedTo)
        : undefined,
    });
  }

  // Traer todas las tareas de un usuario
  async getTasksByUser(userId: string): Promise<ITask[]> {
    return this.taskRepository.findTasksByUser(userId);
  }

  // Traer TODAS las tareas
  async getAllTasks(): Promise<ITask[]> {
    return this.taskRepository.findAll();
  }

  // Traer todas las tareas de un proyecto
  async getTasksByProject(projectId: string): Promise<ITask[]> {
    return this.taskRepository.findTasksByProject(projectId);
  }

  // Actualizar una tarea
  async updateTask(
    taskId: string,
    updateData: Partial<ITask>
  ): Promise<ITask | null> {
    return this.taskRepository.update(taskId, updateData);
  }

  // Eliminar una tarea
  async deleteTask(taskId: string): Promise<ITask | null> {
    return this.taskRepository.delete(taskId);
  }

  // Asignar una tarea a un usuario
  async assignTaskToUser(
    taskId: string,
    userId: string
  ): Promise<ITask | null> {
    return this.taskRepository.assignTaskToUser(taskId, userId);
  }

  // Buscar tareas por nombre o descripción
  async searchTasks(query: string): Promise<ITask[]> {
    return this.taskRepository.searchTasks(query);
  }

  // Filtrar tareas por estado
  async getTasksByStatus(status: TaskStatus): Promise<ITask[]> {
    return this.taskRepository.getTasksByStatus(status);
  }
}
