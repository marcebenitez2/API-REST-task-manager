# API de Gestión de Tareas

## Descripción del Proyecto

Esta es una API completa de Gestión de Tareas desarrollada con Node.js, TypeScript, Express.js y MongoDB, siguiendo los principios de Arquitectura Limpia.

## Tabla de Contenidos
- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Configuración](#configuración)
- [Ejecución de la Aplicación](#ejecución-de-la-aplicación)
- [Pruebas](#pruebas)
- [Documentación de la API](#documentación-de-la-api)
- [Medidas de Seguridad](#medidas-de-seguridad)

## Características

- Autenticación de Usuarios (Registro, Inicio de Sesión, Cierre de Sesión)
- Gestión de Proyectos (Operaciones CRUD)
- Gestión de Tareas (Operaciones CRUD)
  - Asignación de Tareas
  - Seguimiento de Estado de Tareas
- Búsqueda y Filtrado Avanzado
- Límite de Peticiones (Rate Limiting)
- Registro de Logs
- Documentación de API con Swagger

## Requisitos Previos

- Node.js (v18+ recomendado)
- npm
- MongoDB
- Git

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/marcebenitez2/API-REST-task-manager.git
   cd API-REST-task-manager
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Crear un archivo `.env` en el directorio raíz con las siguientes variables:
   ```
    MONGODB_URI=mongodb://localhost:27017/task_management
    JWT_SECRET=mysecret
   ```

## Estructura del Proyecto

```
Api
├─ src/
│  ├─ application/       # Capa de lógica de negocio
│  ├─ config/            # Archivos de configuración
│  ├─ domain/            # Modelos de dominio y repositorios
│  ├─ infrastructure/    # Servidor, rutas, middleware
│  └─ test/              # Archivos de pruebas
```

### Componentes Principales
- **Arquitectura Limpia**: Separa las preocupaciones entre las capas de dominio, aplicación e infraestructura
- **TypeScript**: Proporciona seguridad de tipos
- **Express.js**: Framework de aplicaciones web
- **Mongoose**: Modelado de objetos para MongoDB
- **JWT**: Mecanismo de autenticación

## Configuración

Archivos de configuración clave:
- `src/config/environment.ts`: Variables de entorno
- `src/config/logger.ts`: Configuración de registros
- `src/config/swagger.ts`: Configuración de documentación Swagger

## Ejecución de la Aplicación

### Modo Desarrollo
```bash
npm run dev
```

### Modo Producción
```bash
npm run build
npm start
```

## Pruebas

### Ejecutar Pruebas
```bash
npm test
```

### Cobertura de Pruebas
- Framework: Jest
- Objetivo de Cobertura: 80%
- Tipos de Pruebas:
  - Pruebas Unitarias
  - Pruebas de Integración
  - Dependencias Externas Simuladas

## Documentación de la API

Swagger UI disponible en: `http://localhost:3000/api-docs`

Endpoints:
- `/api/users`: Gestión de usuarios
- `/api/projects`: Gestión de proyectos
- `/api/tasks`: Gestión de tareas

## Medidas de Seguridad

- Autenticación JWT
- Validación de Entradas
- Límite de Peticiones
- Compresión de Respuestas
- Helmet para Cabeceras HTTP
- Middleware de Manejo de Errores

## Optimizaciones de Rendimiento

- Índices de MongoDB
- Caché en Memoria
- Respuestas Comprimidas

## Despliegue

Fue desplegado en netlify

Pasos de Despliegue:
1. Crear carpeta functions
2. Configurar el netlify.toml
3. Permitir conexion desde mongoATLAS

Se probaron todos los endpoints y funcionan correctamente
![image](https://github.com/user-attachments/assets/bf6ce9f2-8f2b-4cdc-84e3-d96a909d0e10)



```
Api
├─ .eslintrc.js
├─ .gitignore
├─ .prettierrc
├─ jest.config.js
├─ jest.setup.js
├─ logs
├─ netlify
│  └─ functions
│     └─ index.ts
├─ netlify.toml
├─ package-lock.json
├─ package.json
├─ README.md
├─ src
│  ├─ application
│  │  ├─ controllers
│  │  │  ├─ projectController.ts
│  │  │  ├─ taskController.ts
│  │  │  └─ userController.ts
│  │  ├─ services
│  │  │  ├─ projectService.ts
│  │  │  ├─ taskService.ts
│  │  │  └─ userService.ts
│  │  └─ validations
│  │     ├─ projectValidation.ts
│  │     ├─ taskValidation.ts
│  │     └─ userValidation.ts
│  ├─ config
│  │  ├─ cache.ts
│  │  ├─ environment.ts
│  │  ├─ logger.ts
│  │  └─ swagger.ts
│  ├─ domain
│  │  ├─ models
│  │  │  ├─ project.ts
│  │  │  ├─ task.ts
│  │  │  └─ user.ts
│  │  └─ repositories
│  │     ├─ GenericRepository.ts
│  │     ├─ ProjectRepository.ts
│  │     ├─ TaskRepository.ts
│  │     └─ UserRepository.ts
│  ├─ index.ts
│  ├─ infrastructure
│  │  └─ server
│  │     └─ express
│  │        ├─ middleware
│  │        │  ├─ AuthMiddleware.ts
│  │        │  ├─ ErrorHandlingMiddleware.ts
│  │        │  └─ ValidationMiddleware.ts
│  │        └─ routes
│  │           ├─ ProjectRoutes.ts
│  │           ├─ TaskRoutes.ts
│  │           └─ UserRoutes.ts
│  └─ test
│     ├─ projectController.test.ts
│     ├─ taskController.test.ts
│     └─ userController.test.ts
└─ tsconfig.json

```
