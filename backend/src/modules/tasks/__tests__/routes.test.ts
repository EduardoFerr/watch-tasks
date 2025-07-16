import supertest from 'supertest';
import { jest } from '@jest/globals';
import buildApp from '../../../app.js';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import type { Task, Prisma } from '@prisma/client';

// Declaramos a variável da nossa aplicação aqui
let app: FastifyInstance;

// --- ALTERAÇÃO AQUI: Mocks tipados na declaração ---
// Definimos os tipos de retorno esperados para as funções do Prisma.
const mockPrisma = {
  task: {
    findMany: jest.fn<() => Promise<Task[]>>(),
    create: jest.fn<(args: { data: Prisma.TaskCreateInput }) => Promise<Task>>(),
  },
};

const mockAuthenticate = jest.fn();

describe('Task Routes', () => {
  // Construímos a nossa aplicação com os mocks antes de todos os testes
  beforeAll(async () => {
    app = buildApp({
      logger: false, // Desativa os logs para uma saída de teste limpa
      mocks: {
        prisma: mockPrisma,
        authenticate: mockAuthenticate,
      },
    });
    await app.ready();
  });

  // Garante que o servidor é fechado corretamente
  afterAll(async () => {
    await app.close();
  });

  // Limpa os mocks depois de cada teste
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /tasks', () => {
    it('deve falhar com 401 se o utilizador não estiver autenticado', async () => {
      mockAuthenticate.mockImplementation(async (request: any, reply: any) => {
        return reply.code(401).send({ message: 'Unauthorized' });
      });
      
      const response = await supertest(app.server).get('/tasks');
      expect(response.status).toBe(401);
    });

    it('deve retornar a lista de tarefas para um utilizador autenticado', async () => {
      const mockUser = {
        userId: 'user-test-id',
        name: 'Test User',
        avatarUrl: 'http://example.com/avatar.png'
      };
      
      mockAuthenticate.mockImplementation(async (request: any, reply: any) => {
        request.user = mockUser;
      });

      const mockTasks: Task[] = [{
        id: 'task-1', title: 'Tarefa de Teste', description: null, status: 'PENDING',
        createdAt: new Date(), updatedAt: new Date(), authorId: mockUser.userId, categoryId: null
      }];
      
      // Agora o TypeScript entende o tipo e não precisamos de 'as jest.Mock'.
      mockPrisma.task.findMany.mockResolvedValue(mockTasks);

      const response = await supertest(app.server).get('/tasks');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTasks.map(t => ({...t, createdAt: t.createdAt.toISOString(), updatedAt: t.updatedAt.toISOString()})));
    });
  });

  describe('POST /tasks', () => {
    it('deve criar uma nova tarefa para um utilizador autenticado', async () => {
      const mockUser = {
        userId: 'user-test-id',
        name: 'Test User',
        avatarUrl: 'http://example.com/avatar.png'
      };
      
      mockAuthenticate.mockImplementation(async (request: any, reply: any) => {
        request.user = mockUser;
      });

      const newTaskData = { title: 'Nova Tarefa', description: 'Descrição' };
      const createdTask: Task = {
        ...newTaskData, id: 'new-task-id', status: 'PENDING',
        createdAt: new Date(), updatedAt: new Date(), authorId: mockUser.userId, categoryId: null
      };
      
      mockPrisma.task.create.mockResolvedValue(createdTask);

      const response = await supertest(app.server).post('/tasks').send(newTaskData);
      expect(response.status).toBe(201);
      expect(response.body).toEqual({...createdTask, createdAt: createdTask.createdAt.toISOString(), updatedAt: createdTask.updatedAt.toISOString()});
    });
  });
});
