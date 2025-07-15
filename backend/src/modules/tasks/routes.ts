import type { FastifyInstance, FastifyRequest } from 'fastify';
import { Status } from '@prisma/client';

// Interfaces para os tipos de corpo da requisição e parâmetros
interface CreateTaskBody {
  title: string;
  description?: string;
}

interface UpdateTaskBody {
  title?: string;
  description?: string;
  status?: Status;
}

interface IdParams {
  id: string;
}

export default async function taskRoutes(fastify: FastifyInstance) {

  /**
   * Rota para obter todas as tarefas do utilizador autenticado
   */
  fastify.get('/', { onRequest: [fastify.authenticate] }, async (request: FastifyRequest, reply) => {
    try {
      const tasks = await fastify.prisma.task.findMany({
        where: {
          authorId: request.user.userId, 
        },
        orderBy: {
          createdAt: 'desc', 
        },
      });
      reply.send(tasks);
    } catch (error) {
      fastify.log.error(error, 'Erro ao buscar tarefas.');
      reply.code(500).send({ message: 'Erro interno ao buscar tarefas.' });
    }
  });

  /**
   * Rota para criar uma nova tarefa para o utilizador autenticado
   */
  fastify.post<{ Body: CreateTaskBody }>('/', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { title, description } = request.body;
    try {
      const newTask = await fastify.prisma.task.create({
        data: {
          title,
          description,
          authorId: request.user.userId,
        },
      });
      
      // Notifica todos os clientes sobre a nova tarefa
      fastify.broadcast({ type: 'TASK_CREATED', payload: newTask });
      
      reply.code(201).send(newTask);
    } catch (error) {
      fastify.log.error(error, 'Erro ao criar a tarefa.');
      reply.code(500).send({ message: 'Erro interno ao criar a tarefa.' });
    }
  });

  /**
   * Rota para atualizar uma tarefa existente
   */
  fastify.put<{ Body: UpdateTaskBody, Params: IdParams }>('/:id', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params;
    try {
      const task = await fastify.prisma.task.findFirst({
        where: { id, authorId: request.user.userId },
      });

      if (!task) {
        return reply.code(404).send({ message: 'Tarefa não encontrada ou não pertence a si.' });
      }

      const updatedTask = await fastify.prisma.task.update({
        where: { id },
        data: request.body,
      });

      fastify.broadcast({ type: 'TASK_UPDATED', payload: updatedTask });
      
      reply.send(updatedTask);
    } catch (error) {
      fastify.log.error(error, 'Erro ao atualizar a tarefa.');
      reply.code(500).send({ message: 'Erro interno ao atualizar a tarefa.' });
    }
  });

  /**
   * Rota para apagar uma tarefa
   */
  fastify.delete<{ Params: IdParams }>('/:id', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params;
    try {
      const task = await fastify.prisma.task.findUnique({
        where: { id },
      });

      if (!task || task.authorId !== request.user.userId) {
        return reply.code(404).send({ message: 'Tarefa não encontrada ou não tem permissão para a apagar.' });
      }

      await fastify.prisma.task.delete({ where: { id } });

      fastify.broadcast({ type: 'TASK_DELETED', payload: { id } });

      reply.code(204).send();
    } catch (error) {
      fastify.log.error(error, 'Erro ao apagar a tarefa.');
      reply.code(500).send({ message: 'Erro interno ao apagar a tarefa.' });
    }
  });
}
