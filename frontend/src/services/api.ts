import axios, { type AxiosResponse } from 'axios';
import type { Task, TaskCreatePayload, TaskUpdatePayload } from '@/types';

const apiClient = axios.create({
  baseURL: '/api', // Usando o proxy do Vite
  headers: {
    'Content-Type': 'application/json',
  },
  // Garante que os cookies (com o token) sejam enviados com as requisições
  withCredentials: true,
});

export default {
  getMe() {
    return apiClient.get('/auth/me');
  },

  getTasks(): Promise<AxiosResponse<Task[]>> {
    return apiClient.get('/tasks');
  },
  createTask(taskData: TaskCreatePayload): Promise<AxiosResponse<Task>> {
    return apiClient.post('/tasks', taskData);
  },
  updateTask(id: string, taskData: TaskUpdatePayload): Promise<AxiosResponse<Task>> {
    return apiClient.put(`/tasks/${id}`, taskData);
  },
  deleteTask(id: string): Promise<AxiosResponse<void>> {
    return apiClient.delete(`/tasks/${id}`);
  },
};
