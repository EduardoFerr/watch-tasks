import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/services/api';

interface User {
  userId: string;
  name: string;
  avatarUrl: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);

  const isAuthenticated = computed(() => !!user.value);

  async function checkAuthStatus() {
    try {
      const response = await api.getMe();
      user.value = response.data;
    } catch (error) {
      user.value = null;
      console.error('Utilizador não está autenticado.', error);
    }
  }

  function logout() {
    user.value = null;
    window.location.href = '/api/auth/logout';
  }

  return {
    user,
    isAuthenticated,
    checkAuthStatus,
    logout,
  };
});
