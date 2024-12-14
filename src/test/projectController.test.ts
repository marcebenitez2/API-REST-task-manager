import request from 'supertest';
import app from '../index';
import cache from '../config/cache'; // Importamos el caché
import { IProject } from '../domain/models/project';

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

    // Limpiar caché de proyectos cuando se crea uno nuevo
    cache.del('allProjects'); // Limpiar el caché de todos los proyectos
  });

  it('should get all projects (with cache)', async () => {
    let response;

    // Intentamos obtener el caché de los proyectos
    const cachedProjects = cache.get<IProject[]>('allProjects');
    if (cachedProjects) {
      console.log('Returning cached projects');
      response = { status: 200, body: cachedProjects }; // Si hay caché, lo devolvemos
    } else {
      // Si no hay caché, obtenemos los proyectos de la base de datos
      response = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${authToken}`);

      // Almacenamos en caché los proyectos obtenidos
      if (response.status === 200) {
        cache.set('allProjects', response.body); // Guardamos los proyectos en caché
      }
    }

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should get a project by ID (with cache)', async () => {
    let response;

    // Intentamos obtener el proyecto desde el caché
    const cachedProject = cache.get<IProject>(`project:${testProjectId}`);
    if (cachedProject) {
      console.log('Returning cached project');
      response = { status: 200, body: cachedProject }; // Si está en caché, lo devolvemos
    } else {
      // Si no está en caché, obtenemos el proyecto de la base de datos
      response = await request(app)
        .get(`/api/projects/${testProjectId}`)
        .set('Authorization', `Bearer ${authToken}`);

      // Almacenamos el proyecto en caché
      if (response.status === 200) {
        cache.set(`project:${testProjectId}`, response.body); // Guardamos el proyecto en caché
      }
    }

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', testProjectId);
    expect(response.body).toHaveProperty('name', 'Test Project');
  });

  it('should update a project and clear cache', async () => {
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

    // Limpiar caché después de la actualización
    cache.del('allProjects'); // Eliminar caché global de proyectos
    cache.del(`project:${testProjectId}`); // Eliminar caché de ese proyecto específico
  });

  it('should delete a project and clear cache', async () => {
    const response = await request(app)
      .delete(`/api/projects/${testProjectId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', testProjectId);
    expect(response.body).toHaveProperty('name', 'Updated Project Name');

    // Limpiar caché después de eliminar el proyecto
    cache.del('allProjects'); // Eliminar caché global de proyectos
    cache.del(`project:${testProjectId}`); // Eliminar caché de ese proyecto específico
  });
});
