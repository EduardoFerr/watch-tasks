import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { z } from 'zod';
import { TaskSchema, type Task, type TaskCreatePayload, type TaskUpdatePayload } from '@/types';
import api from '@/services/api';
import { socket } from '@/services/socket';

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const totalTasks = computed(() => tasks.value.length);

  function sortTasks() {
    tasks.value.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  function connectWebSocket() {
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const { type, payload } = message;

        if (type === 'ping') {
          socket.send(JSON.stringify({ type: 'pong' }));
          return;
        }
        
        console.log('Mensagem de tarefa recebida:', message);

        switch (type) {
          case 'TASK_CREATED':
            if (!tasks.value.some(t => t.id === payload.id)) {
              tasks.value.push(payload);
              sortTasks();
            }
            break;
          case 'TASK_UPDATED':
            tasks.value = tasks.value.map(t => t.id === payload.id ? payload : t);
            sortTasks();
            break;
          case 'TASK_DELETED':
            tasks.value = tasks.value.filter(t => t.id !== payload.id);
            break;
        }
      } catch (e) {
        console.error('Falha ao processar a mensagem do WebSocket:', e);
      }
    };
  }

  async function fetchTasks() {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.getTasks();
      const validation = z.array(TaskSchema).safeParse(response.data);
      if (!validation.success) {
        console.error('Erro de validação Zod:', validation.error);
        throw new Error('Os dados recebidos da API são inválidos.');
      }
      tasks.value = validation.data;
      sortTasks();
    } catch (err: any) {
      error.value = err.message || 'Falha ao buscar tarefas.';
    } finally {
      loading.value = false;
    }
  }


  async function createTask(taskData: TaskCreatePayload) {
    try {
      await api.createTask(taskData);
    } catch (err: any) {
      error.value = err.message || 'Falha ao criar a tarefa.';
    }
  }

  async function updateTask(id: string, taskData: TaskUpdatePayload) {
    try {
      await api.updateTask(id, taskData);
    } catch (err: any) {
      error.value = err.message || 'Falha ao atualizar a tarefa.';
    }
  }
  
  async function deleteTask(id: string) {
    try {
      await api.deleteTask(id);
    } catch (err: any) {
      error.value = err.message || 'Falha ao apagar a tarefa.';
    }
  }

  return {
    tasks,
    loading,
    error,
    totalTasks,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    connectWebSocket,
  };
});
