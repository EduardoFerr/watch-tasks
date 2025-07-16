import Fastify, { type FastifyInstance } from 'fastify';
import cookie from '@fastify/cookie';
import jwt, { type JWT } from '@fastify/jwt';
import websocket from '@fastify/websocket';
import { PrismaClient } from '@prisma/client';
import prismaPlugin from './plugins/prisma.js';
import redisPlugin from './plugins/redis.js';
import authRoutes from './modules/auth/routes.js';
import taskRoutes from './modules/tasks/routes.js';
import websocketRoutes from './modules/ws/routes.js';

// Adiciona a tipagem para o 'user' no request do Fastify.
declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      userId: string;
      name: string | null;
      avatarUrl: string | null;
    }
  }
}

// Adiciona a tipagem para as nossas funções de decorator e plugins
declare module 'fastify' {
  export interface FastifyInstance {
    broadcast(message: any): void;
    authenticate(request: any, reply: any): Promise<void>;
    prisma: PrismaClient;
    jwt: JWT;
    githubOAuth: any; // Adicionado para o plugin de OAuth
  }
}

function buildApp(options: { logger: boolean, mocks?: any } = { logger: true }) {
  // O tracing só é inicializado se não estivermos em modo de teste.
  if (process.env.NODE_ENV !== 'test') {
    import('./tracing.js');
  }

  const fastify: FastifyInstance = Fastify({
    logger: options.logger
  });

  // Se estivermos em modo de teste, usa os mocks.
  if (options.mocks) {
    fastify.decorate('prisma', options.mocks.prisma);
    fastify.decorate('authenticate', options.mocks.authenticate);
  } else {
    // Caso contrário, regista os plugins reais.
    fastify.register(jwt, { 
      secret: 'supersecret', 
      cookie: { 
        cookieName: 'token', 
        signed: false 
      } 
    });
    fastify.register(prismaPlugin);
    fastify.register(redisPlugin);

    // E o decorator de autenticação real.
    fastify.decorate('authenticate', async function (request, reply) {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.code(401).send({ message: 'Unauthorized' });
      }
    });
  }

  fastify.register(cookie);
  fastify.register(websocket);
  
  // Decorator de Broadcast
  fastify.decorate('broadcast', function (message: any) {
    for (const client of this.websocketServer.clients) {
      client.send(JSON.stringify(message));
    }
  });

  // Regista as rotas
  fastify.register(authRoutes);
  fastify.register(taskRoutes, { prefix: '/tasks' });
  fastify.register(websocketRoutes);

  fastify.get('/', async (request, reply) => {
    return { status: 'API is running' };
  });
  
  return fastify;
}

export default buildApp;
