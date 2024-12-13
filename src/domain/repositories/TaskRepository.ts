import { ITask, Task, TaskStatus } from '../models/task';
import { GenericRepository } from './GenericRepository';

export class TaskRepository extends GenericRepository<ITask> {
  constructor() {
    super(Task);
  }

  async findTasksByProject(projectId: string): Promise<ITask[]> {
    return this.model.find({ project: projectId });
  }

  async findTasksByUser(userId: string): Promise<ITask[]> {
    return this.model.find({ assignedTo: userId });
  }

  async findTasksByFilter(filter: {
    projectId?: string;
    status?: TaskStatus;
    assignedTo?: string;
    searchTerm?: string;
  }): Promise<ITask[]> {
    const query: any = {};

    if (filter.projectId) query.project = filter.projectId;
    if (filter.status) query.status = filter.status;
    if (filter.assignedTo) query.assignedTo = filter.assignedTo;

    if (filter.searchTerm) {
      query.$or = [
        { title: { $regex: filter.searchTerm, $options: 'i' } },
        { description: { $regex: filter.searchTerm, $options: 'i' } },
      ];
    }

    return this.model.find(query);
  }

  async assignTaskToUser(
    taskId: string,
    userId: string
  ): Promise<ITask | null> {
    return this.model.findByIdAndUpdate(
      taskId,
      { assignedTo: userId },
      { new: true }
    );
  }
}