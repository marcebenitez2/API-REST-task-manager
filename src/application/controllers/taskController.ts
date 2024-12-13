import { Request, Response } from 'express';
import { TaskService } from '../services/taskService';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  // Ruta para crear una nueva tarea
  async createTask(req: Request, res: Response) {
    const taskData = {
      ...req.body,
      owner: req.user!.id,
    };

    const task = await this.taskService.createTask(taskData);

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  }

  // Ruta para obtener tareas asignadas al usuario autenticado
  async getTasks(req: Request, res: Response) {
    const tasks = await this.taskService.getTasksByUser(req.user!.id);
    res.json(tasks);
  }

  //Ruta para traer TODAS las tareas
  async getAllTasks(req: Request, res: Response) {
    const tasks = await this.taskService.getAllTasks();
    res.json(tasks);
  }

  // Ruta para obtener tareas de un proyecto específico
  async getTasksByProject(req: Request, res: Response) {
    const { projectId } = req.params;
    const tasks = await this.taskService.getTasksByProject(projectId);

    res.json(tasks);
  }

  async updateTask(req: Request, res: Response) {
    const { id } = req.params;
    const updatedTask = await this.taskService.updateTask(id, req.body);

    res.json({
      message: 'Task updated successfully',
      task: updatedTask,
    });
  }

  async deleteTask(req: Request, res: Response) {
    const { id } = req.params;
    await this.taskService.deleteTask(id);

    res.json({ message: 'Task deleted successfully' });
  }

  async assignTask(req: Request, res: Response) {
    const { taskId } = req.params;
    const { userId } = req.body;

    const updatedTask = await this.taskService.assignTaskToUser(taskId, userId);

    res.json({
      message: 'Task assigned successfully',
      task: updatedTask,
    });
  }
}
