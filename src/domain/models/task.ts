import mongoose from 'mongoose';

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export interface ITask extends mongoose.Document {
  title: string;
  description?: string;
  status: TaskStatus;
  project: mongoose.Types.ObjectId | string;
  assignedTo?: mongoose.Types.ObjectId[];
  dueDate?: Date;
}

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: Object.values(TaskStatus),
    default: TaskStatus.PENDING,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  assignedTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  dueDate: { type: Date },
});

TaskSchema.index({ project: 1 });
TaskSchema.index({ assignedTo: 1 });
TaskSchema.index({ status: 1 });

export const Task = mongoose.model<ITask>('Task', TaskSchema);
