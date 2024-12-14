import Joi from 'joi';
import { TaskStatus } from '../../domain/models/task';

export const createTaskValidation = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Task title must be at least 3 characters long',
    'string.max': 'Task title cannot be longer than 100 characters',
    'any.required': 'Task title is required',
  }),

  description: Joi.string().optional().max(500).messages({
    'string.max': 'Description cannot be longer than 500 characters',
  }),

  project: Joi.string().required().messages({
    'any.required': 'Project ID is required',
  }),

  assignedTo: Joi.string().optional(),

  dueDate: Joi.date().optional().messages({
    'date.base': 'Due date must be a valid date',
  }),

  status: Joi.string()
    .valid(...Object.values(TaskStatus))
    .optional(),
});

export const updateTaskValidation = Joi.object({
  title: Joi.string().min(3).max(100).optional().messages({
    'string.min': 'Task title must be at least 3 characters long',
    'string.max': 'Task title cannot be longer than 100 characters',
  }),

  description: Joi.string().optional().max(500).messages({
    'string.max': 'Description cannot be longer than 500 characters',
  }),

  assignedTo: Joi.string().optional(),

  dueDate: Joi.date().optional().messages({
    'date.base': 'Due date must be a valid date',
  }),

  status: Joi.string()
    .valid(...Object.values(TaskStatus))
    .optional(),
});

export const assignTaskValidation = Joi.object({
  userIds: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)) // Validar ObjectId
    .min(1)
    .required()
    .messages({
      'array.base': 'User IDs must be an array',
      'array.min': 'At least one user ID must be provided',
      'string.pattern.base': 'Invalid user ID format',
    }),
});
