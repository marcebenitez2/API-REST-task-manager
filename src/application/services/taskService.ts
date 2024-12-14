import { ITask, TaskStatus } from '../../domain/models/task';
import { TaskRepository } from '../../domain/repositories/TaskRepository';
import mongoose from 'mongoose';
import cache from '../../config/cache'; // Asegúrate de tener el archivo de configuración de cache

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
    // Limpiar el caché relacionado
    cache.del('allTasks');
    return this.taskRepository.create({
      ...taskData,
      project: new mongoose.Types.ObjectId(taskData.project),
      status: TaskStatus.PENDING,
      assignedTo: taskData.assignedTo
        ? taskData.assignedTo.map((id) => new mongoose.Types.ObjectId(id))
        : undefined,
    });
  }

  // Traer todas las tareas
  async getAllTasks(): Promise<ITask[]> {
    // Verificar en caché
    const cachedTasks = cache.get<ITask[]>('allTasks');
    if (cachedTasks) {
      console.log('Returning cached tasks');
      return cachedTasks; // Devuelve las tareas desde el caché
    }

    const tasks = await this.taskRepository.findAll();
    cache.set('allTasks', tasks); // Almacenar en caché
    return tasks;
  }

  // Traer todas las tareas de un usuario
  async getTasksByUser(userId: string): Promise<ITask[]> {
    const cacheKey = `tasksByUser:${userId}`;
    const cachedTasks = cache.get<ITask[]>(cacheKey);
    if (cachedTasks) {
      console.log('Returning cached user tasks');
      return cachedTasks; // Devuelve las tareas de usuario desde el caché
    }

    const tasks = await this.taskRepository.findTasksByUser(userId);
    cache.set(cacheKey, tasks); // Almacenar en caché
    return tasks;
  }

  // Traer todas las tareas de un proyecto
  async getTasksByProject(projectId: string): Promise<ITask[]> {
    const cacheKey = `tasksByProject:${projectId}`;
    const cachedTasks = cache.get<ITask[]>(cacheKey);
    if (cachedTasks) {
      console.log('Returning cached project tasks');
      return cachedTasks; // Devuelve las tareas de proyecto desde el caché
    }

    const tasks = await this.taskRepository.findTasksByProject(projectId);
    cache.set(cacheKey, tasks); // Almacenar en caché
    return tasks;
  }

  // Actualizar una tarea
  async updateTask(
    taskId: string,
    updateData: Partial<ITask>
  ): Promise<ITask | null> {
    // Limpiar el caché de la tarea actualizada
    cache.del(`task:${taskId}`);
    return this.taskRepository.update(taskId, updateData);
  }

  // Eliminar una tarea
  async deleteTask(taskId: string): Promise<ITask | null> {
    // Limpiar el caché de todas las tareas y de la tarea específica eliminada
    cache.del('allTasks');
    cache.del(`task:${taskId}`);
    return this.taskRepository.delete(taskId);
  }

  // Asignar una tarea a un usuario
  async assignTaskToUsers(
    taskId: string,
    userIds: string[]
  ): Promise<ITask | null> {
    // Limpiar caché de la tarea y todas las tareas
    cache.del(`task:${taskId}`);
    cache.del('allTasks');
    return this.taskRepository.assignTaskToUsers(taskId, userIds);
  }

  // Desasignar un usuario de una tarea
  async unassignUserFromTask(
    taskId: string,
    userId: string
  ): Promise<ITask | null> {
    // Limpiar caché de la tarea
    cache.del(`task:${taskId}`);
    return this.taskRepository.unassignUserFromTask(taskId, userId);
  }

  // Buscar tareas por nombre o descripción
  async searchTasks(query: string): Promise<ITask[]> {
    const cacheKey = `searchTasks:${query}`;
    const cachedTasks = cache.get<ITask[]>(cacheKey);
    if (cachedTasks) {
      console.log('Returning cached search tasks');
      return cachedTasks; // Devuelve las tareas buscadas desde el caché
    }

    const tasks = await this.taskRepository.searchTasks(query);
    cache.set(cacheKey, tasks); // Almacenar en caché
    return tasks;
  }

  // Filtrar tareas por estado
  async getTasksByStatus(status: TaskStatus): Promise<ITask[]> {
    const cacheKey = `tasksByStatus:${status}`;
    const cachedTasks = cache.get<ITask[]>(cacheKey);
    if (cachedTasks) {
      console.log('Returning cached status tasks');
      return cachedTasks; // Devuelve las tareas con el estado filtrado desde el caché
    }

    const tasks = await this.taskRepository.getTasksByStatus(status);
    cache.set(cacheKey, tasks); // Almacenar en caché
    return tasks;
  }
}
