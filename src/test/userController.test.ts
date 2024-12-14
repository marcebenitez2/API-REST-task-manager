import request from 'supertest';
import app from '../index';

describe('User Controller', () => {
  let authToken: string;
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
  });

  it('should register a new user', async () => {
    const response = await request(app).post('/api/users/register').send({
      username: 'newuser',
      password: 'newpassword',
      email: 'newuser@example.com',
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
  });

  it('should log in an existing user and return a token', async () => {
    const response = await request(app).post('/api/users/login').send({
      email: testEmail,
      password: testPassword,
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('should get the profile of the authenticated user', async () => {
    const response = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Authenticated user profile');
    expect(response.body.user).toBeDefined();
    expect(response.body.user).toHaveProperty('id');
    expect(typeof response.body.user.id).toBe('string');
    expect(response.body.user.id.length).toBeGreaterThan(0);
  });

  it('should simulate logging out a user', async () => {
    const response = await request(app)
      .post('/api/users/logout')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      'Simulation of session closing completed.'
    );
  });
});
