import request from 'supertest';
import app from '../index';

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

  it('should get tasks assigned to the authenticated user', async () => {
    const response = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

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

  it('should delete a task', async () => {
    const response = await request(app)
      .delete(`/api/tasks/${testTaskId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Task deleted successfully');
  });

  it('should assign a task to a user', async () => {
    const response = await request(app)
      .post(`/api/tasks/${testTaskId}/assign`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        userId: '1234567890abcdef12345678',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User assigned to task successfully');
  });

  it('should unassign a user from a task', async () => {
    const response = await request(app)
      .post(`/api/tasks/${testTaskId}/unassign`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        userId: '1234567890abcdef12345678',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User unassigned successfully');
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
