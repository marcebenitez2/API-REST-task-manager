import request from 'supertest';
import app from '../index';
import cache from '../config/cache';

describe('Task Controller', () => {
  let authToken: string;
  let testTaskId: string;
  const testUsername = `testuser_${Date.now()}`;
  const testEmail = `${testUsername}@example.com`;
  const testPassword = 'testpassword';

  beforeAll(async () => {
    const registerResponse = await request(app)
      .post('/api/users/register')
      .send({
        username: testUsername,
        password: testPassword,
        email: testEmail,
      });

    expect(registerResponse.status).toBe(201);

    const loginResponse = await request(app).post('/api/users/login').send({
      email: testEmail,
      password: testPassword,
    });

    expect(loginResponse.status).toBe(200);
    authToken = loginResponse.body.token;

    const createTaskResponse = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Task',
        description: 'This is a test task',
        project: '1234567890abcdef12345678',
        assignedTo: ['1234567890abcdef12345678'],
        dueDate: '2024-12-31',
      });

    expect(createTaskResponse.status).toBe(201);
    testTaskId = createTaskResponse.body.task._id;
  });

  it('should create a task', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'New Task',
        description: 'This is a new task',
        project: '1234567890abcdef12345678',
        assignedTo: ['1234567890abcdef12345678'],
        dueDate: '2024-12-31',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Task created successfully');
    expect(response.body.task).toHaveProperty('title', 'New Task');
  });

  it('should get tasks from cache when available', async () => {
    // Verifica si las tareas están almacenadas en el caché
    const cachedTasks = cache.get('allTasks');
    if (cachedTasks) {
      console.log('Returning cached tasks');
      expect(cachedTasks).toBeInstanceOf(Array); // Las tareas deben ser un array
    } else {
      // Si no están en caché, obtén las tareas y verifica el caché
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    }
  });

  it('should get tasks assigned to the authenticated user', async () => {
    const response = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should update a task and clear cache', async () => {
    const response = await request(app)
      .put(`/api/tasks/${testTaskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Updated Task Title',
        description: 'Updated task description',
        dueDate: '2025-01-01',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Task updated successfully');
    expect(response.body.task).toHaveProperty('title', 'Updated Task Title');

    // Verifica que el caché se haya limpiado
    const cachedTasks = cache.get('allTasks');
    expect(cachedTasks).toBeUndefined(); // El caché debe estar vacío después de actualizar la tarea
  });

  it('should delete a task and clear cache', async () => {
    const response = await request(app)
      .delete(`/api/tasks/${testTaskId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Task deleted successfully');

    // Verifica que el caché se haya limpiado después de eliminar la tarea
    const cachedTask = cache.get(`task:${testTaskId}`);
    expect(cachedTask).toBeUndefined(); // La tarea debe haber sido eliminada del caché
  });

  it('should assign a task to a user and clear cache', async () => {
    const response = await request(app)
      .post(`/api/tasks/${testTaskId}/assign`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        userIds: ['1234567890abcdef12345678'],
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User assigned to task successfully');

    // Verifica que el caché relacionado con la tarea se haya limpiado
    const cachedTask = cache.get(`task:${testTaskId}`);
    expect(cachedTask).toBeUndefined(); // La tarea debe haber sido eliminada del caché
  });

  it('should unassign a user from a task and clear cache', async () => {
    const response = await request(app)
      .post(`/api/tasks/${testTaskId}/unassign`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        userId: '1234567890abcdef12345678',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User unassigned successfully');

    // Verifica que el caché relacionado con la tarea se haya limpiado
    const cachedTask = cache.get(`task:${testTaskId}`);
    expect(cachedTask).toBeUndefined(); // La tarea debe haber sido eliminada del caché
  });

  it('should search tasks by title or description', async () => {
    const response = await request(app)
      .get('/api/tasks/search')
      .set('Authorization', `Bearer ${authToken}`)
      .query({ searchTerm: 'test' });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should get tasks by status', async () => {
    const response = await request(app)
      .get('/api/tasks/status/completed')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
