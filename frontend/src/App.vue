<template>
  <v-app>
    <AppBar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { onMounted, watch } from 'vue';
import AppBar from '@/components/AppBar.vue';
import { useAuthStore } from '@/stores/authStore';
import { useTaskStore } from '@/stores/taskStore'; // Importa a store de tarefas

const authStore = useAuthStore();
const taskStore = useTaskStore(); // Obtém uma instância da store de tarefas


watch(() => authStore.isAuthenticated, (isAuth) => {
  if (isAuth) {
    taskStore.connectWebSocket();
  }
});

onMounted(() => {
  authStore.checkAuthStatus();
});
</script>
