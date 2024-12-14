import request from 'supertest';
import app from '../index';

describe('User Controller', () => {
  let authToken: string;

  // Usar un usuario único para cada prueba
  const testUsername = `testuser_${Date.now()}`;
  const testEmail = `${testUsername}@example.com`;
  const testPassword = 'testpassword';

  // Inicializamos un token de autenticación antes de cada prueba
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
      email: testEmail, // Cambié de username a email
      password: testPassword,
    });

    expect(loginResponse.status).toBe(200);
    authToken = loginResponse.body.token; // Guardamos el token
  });

  // Test de registro de usuario
  it('should register a new user', async () => {
    const response = await request(app).post('/api/users/register').send({
      username: 'newuser',
      password: 'newpassword',
      email: 'newuser@example.com',
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
  });

  // Test de inicio de sesión
  it('should log in an existing user and return a token', async () => {
    const response = await request(app).post('/api/users/login').send({
      email: testEmail, // Cambié de username a email
      password: testPassword,
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  // Test del perfil del usuario autenticado
  it('should get the profile of the authenticated user', async () => {
    const response = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Authenticated user profile');

    // Verificar que el objeto de usuario contenga un id
    expect(response.body.user).toBeDefined();
    expect(response.body.user).toHaveProperty('id');
    expect(typeof response.body.user.id).toBe('string');
    expect(response.body.user.id.length).toBeGreaterThan(0);
  });

  // Test de cierre de sesión
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
