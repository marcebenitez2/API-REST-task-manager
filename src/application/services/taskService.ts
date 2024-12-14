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
    assignedTo?: string[];
    dueDate?: Date;
  }): Promise<ITask> {
    return this.taskRepository.create({
      ...taskData,
      project: new mongoose.Types.ObjectId(taskData.project),
      status: TaskStatus.PENDING,
      assignedTo: taskData.assignedTo
        ? taskData.assignedTo.map((id) => new mongoose.Types.ObjectId(id))
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
  async assignTaskToUsers(
    taskId: string,
    userIds: string[]
  ): Promise<ITask | null> {
    // Validar que los IDs de usuario sean válidos
    if (!userIds.every((id) => mongoose.Types.ObjectId.isValid(id))) {
      throw new Error('Invalid user ID(s)');
    }

    const updatedTask = await this.taskRepository.assignTaskToUsers(
      taskId,
      userIds
    );

    if (!updatedTask) {
      throw new Error('Task not found or update failed');
    }

    return updatedTask;
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
