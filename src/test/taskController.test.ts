import request from 'supertest';
import app from '../index';

describe('Task Controller', () => {
  let authToken: string;
  let testTaskId: string;
  
  // Usuario de prueba
  const testUsername = `testuser_${Date.now()}`;
  const testEmail = `${testUsername}@example.com`;
  const testPassword = 'testpassword';
  
  // Inicializamos un token de autenticación antes de cada prueba (si es necesario)
  beforeAll(async () => {
    // Registramos un nuevo usuario para obtener un token
    const registerResponse = await request(app)
      .post('/api/users/register')
      .send({
        username: testUsername,
        password: testPassword,
        email: testEmail,
      });

    expect(registerResponse.status).toBe(201);

    // Luego iniciamos sesión con el usuario registrado
    const loginResponse = await request(app).post('/api/users/login').send({
      email: testEmail,
      password: testPassword,
    });

    expect(loginResponse.status).toBe(200);
    authToken = loginResponse.body.token; // Guardamos el token

    // Creamos una tarea para usar en otras pruebas
    const createTaskResponse = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Task',
        description: 'This is a test task',
        project: '1234567890abcdef12345678', // Cambia por un ID de proyecto válido
        assignedTo: ['1234567890abcdef12345678'],
        dueDate: '2024-12-31',
      });

    expect(createTaskResponse.status).toBe(201);
    testTaskId = createTaskResponse.body.task._id; // Guardamos el ID de la tarea creada
  });

  // Test de creación de tarea
  it('should create a task', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'New Task',
        description: 'This is a new task',
        project: '1234567890abcdef12345678', // Cambia por un ID de proyecto válido
        assignedTo: ['1234567890abcdef12345678'],
        dueDate: '2024-12-31',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Task created successfully');
    expect(response.body.task).toHaveProperty('title', 'New Task');
  });

  // Test de obtener tareas asignadas
  it('should get tasks assigned to the authenticated user', async () => {
    const response = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  // Test de actualización de tarea
  it('should update a task', async () => {
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
  });

  // Test de eliminación de tarea
  it('should delete a task', async () => {
    const response = await request(app)
      .delete(`/api/tasks/${testTaskId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Task deleted successfully');
  });

  // Test de asignación de tarea a un usuario
  it('should assign a task to a user', async () => {
    const response = await request(app)
      .post(`/api/tasks/${testTaskId}/assign`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        userId: '1234567890abcdef12345678', // Cambia por un ID de usuario válido
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User assigned to task successfully');
  });

  // Test de desasignación de tarea de un usuario
  it('should unassign a user from a task', async () => {
    const response = await request(app)
      .post(`/api/tasks/${testTaskId}/unassign`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        userId: '1234567890abcdef12345678', // Cambia por un ID de usuario válido
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User unassigned successfully');
  });

  // Test de búsqueda de tareas por título o descripción
  it('should search tasks by title or description', async () => {
    const response = await request(app)
      .get('/api/tasks/search')
      .set('Authorization', `Bearer ${authToken}`)
      .query({ searchTerm: 'test' });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  // Test de obtener tareas por estado
  it('should get tasks by status', async () => {
    const response = await request(app)
      .get('/api/tasks/status/completed')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
