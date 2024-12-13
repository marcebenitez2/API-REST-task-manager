import Joi from 'joi';

export const createProjectValidation = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    'string.min': 'Project name must be at least 3 characters long',
    'string.max': 'Project name cannot be longer than 50 characters',
    'any.required': 'Project name is required',
  }),

  description: Joi.string().optional().max(500).messages({
    'string.max': 'Description cannot be longer than 500 characters',
  }),

});

export const updateProjectValidation = Joi.object({
  name: Joi.string().min(3).max(50).optional().messages({
    'string.min': 'Project name must be at least 3 characters long',
    'string.max': 'Project name cannot be longer than 50 characters',
  }),

  description: Joi.string().optional().max(500).messages({
    'string.max': 'Description cannot be longer than 500 characters',
  }),
});
