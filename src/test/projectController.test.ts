import request from 'supertest';
import app from '../index'; // Asegúrate de importar la aplicación correctamente

describe('Project Controller', () => {
  let authToken: string;

  // Usar un usuario único para cada prueba
  const testUsername = `testuser_${Date.now()}`;
  const testEmail = `${testUsername}@example.com`;
  const testPassword = 'testpassword';
  let testProjectId: string;

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

    // Iniciamos sesión con el usuario registrado
    const loginResponse = await request(app).post('/api/users/login').send({
      email: testEmail,
      password: testPassword,
    });

    expect(loginResponse.status).toBe(200);
    authToken = loginResponse.body.token; // Guardamos el token
  });

  // Test de creación de un nuevo proyecto
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
    testProjectId = response.body.project._id; // Guardamos el ID del proyecto para usarlo en otras pruebas
  });

  // Test de obtener todos los proyectos
  it('should get all projects', async () => {
    const response = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  // Test de obtener un proyecto por ID
  it('should get a project by ID', async () => {
    const response = await request(app)
      .get(`/api/projects/${testProjectId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', testProjectId);
    expect(response.body).toHaveProperty('name', 'Test Project');
  });

  // Test de actualizar un proyecto
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

  // Test de eliminar un proyecto
  it('should delete a project', async () => {
    const response = await request(app)
      .delete(`/api/projects/${testProjectId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);

    // Verificar que la respuesta contiene el proyecto con el nombre actualizado
    expect(response.body).toHaveProperty('_id', testProjectId); // Verifica que el ID del proyecto eliminado sea el correcto
    expect(response.body).toHaveProperty('name', 'Updated Project Name'); // Verifica que el nombre del proyecto eliminado sea el esperado (actualizado)
  });
});
