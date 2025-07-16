import type { FastifyInstance } from 'fastify';

export default async function websocketRoutes(fastify: FastifyInstance) {
  fastify.get('/ws', { websocket: true }, (connection /*, req */) => {
    fastify.log.info('Cliente WebSocket conectado!');

    const heartbeat = setInterval(() => {
      if (connection.socket.readyState === connection.socket.OPEN) {
        connection.socket.send(JSON.stringify({ type: 'ping' }));
      }
    }, 10000);

    // --- ALTERAÇÃO AQUI: Adicionamos o tipo 'any' ao parâmetro 'message' ---
    connection.socket.on('message', (message: any) => {
      fastify.log.info(`Mensagem recebida do cliente: ${message.toString()}`);
    });

    connection.socket.on('close', () => {
      fastify.log.info('Cliente WebSocket desconectado.');
      clearInterval(heartbeat);
    });
  });
}
