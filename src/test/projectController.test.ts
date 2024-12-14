import request from 'supertest';
import app from '../index';

describe('Project Controller', () => {
  let authToken: string;
  const testUsername = `testuser_${Date.now()}`;
  const testEmail = `${testUsername}@example.com`;
  const testPassword = 'testpassword';
  let testProjectId: string;

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
  });

  it('should create a new project', async () => {
    const response = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Project',
        description: 'This is a test project',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Project created successfully');
    testProjectId = response.body.project._id;
  });

  it('should get all projects', async () => {
    const response = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should get a project by ID', async () => {
    const response = await request(app)
      .get(`/api/projects/${testProjectId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', testProjectId);
    expect(response.body).toHaveProperty('name', 'Test Project');
  });

  it('should update a project', async () => {
    const response = await request(app)
      .put(`/api/projects/${testProjectId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Updated Project Name',
        description: 'Updated description',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Project updated successfully');
    expect(response.body.project.name).toBe('Updated Project Name');
  });

  it('should delete a project', async () => {
    const response = await request(app)
      .delete(`/api/projects/${testProjectId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', testProjectId);
    expect(response.body).toHaveProperty('name', 'Updated Project Name');
  });
});
