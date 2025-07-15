// Importa e inicializa o nosso sistema de tracing
import './tracing.js';

import Fastify from 'fastify';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import websocket from '@fastify/websocket';
import prismaPlugin from './plugins/prisma.js';
import redisPlugin from './plugins/redis.js';
import authRoutes from './modules/auth/routes.js';
import taskRoutes from './modules/tasks/routes.js';
import websocketRoutes from './modules/ws/routes.js';

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      userId: string;
      name: string | null;
      avatarUrl: string | null;
    }
  }
}

declare module 'fastify' {
  export interface FastifyInstance {
    broadcast(message: any): void;
  }
}

const fastify = Fastify({
  logger: true
});

fastify.register(cookie);
fastify.register(jwt, {
  secret: 'segredo', // NOTA: lembrar de trocar por variável de ambiente em produção
  cookie: {
    cookieName: 'token',
    signed: false,
  }
});
fastify.register(websocket);
fastify.register(prismaPlugin);
fastify.register(redisPlugin);

fastify.decorate('broadcast', function (message: any) {
  for (const client of this.websocketServer.clients) {
    client.send(JSON.stringify(message));
  }
});

fastify.decorate('authenticate', async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

fastify.register(authRoutes);
fastify.register(taskRoutes, { prefix: '/tasks' });
fastify.register(websocketRoutes);

// Rota de teste
fastify.get('/', async (request, reply) => {
  return { status: 'API is running' };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3333, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
