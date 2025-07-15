import fp from 'fastify-plugin';
import { createClient } from 'redis';
import type { FastifyInstance } from 'fastify';

// Estende a interface do Fastify para que ele conheça o `fastify.redis`
declare module 'fastify' {
  interface FastifyInstance {
    redis: ReturnType<typeof createClient>;
  }
}

/**
 * Este plugin cria uma instância do cliente Redis e conecta-se ao servidor.
 */
async function redisPlugin(fastify: FastifyInstance) {
  // NOTA: As opções de URL virão das nossas variáveis de ambiente no docker-compose.
  const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
  });

  redisClient.on('error', (err) => fastify.log.error(err, 'Erro no Cliente Redis'));

  await redisClient.connect();

  fastify.decorate('redis', redisClient);

  fastify.addHook('onClose', async (server) => {
    await server.redis.quit();
  });
}

export default fp(redisPlugin);
