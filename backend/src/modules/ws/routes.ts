import type { FastifyInstance } from 'fastify';

export default async function websocketRoutes(fastify: FastifyInstance) {
  fastify.get('/ws', { websocket: true }, (connection /*, req */) => {
    fastify.log.info('Cliente WebSocket conectado!');

    // Envia um "ping" para o cliente a cada 10 segundos para manter a ligação ativa.
    const heartbeat = setInterval(() => {
      if (connection.socket.readyState === connection.socket.OPEN) {
        connection.socket.send(JSON.stringify({ type: 'ping' }));
      }
    }, 10000);

    connection.socket.on('message', message => {
      fastify.log.info(`Mensagem recebida do cliente: ${message.toString()}`);
    });

    connection.socket.on('close', () => {
      fastify.log.info('Cliente WebSocket desconectado.');
      clearInterval(heartbeat);
    });
  });
}
