<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title class="font-weight-bold">Task Manager</v-toolbar-title>
    <v-spacer></v-spacer>

    <v-btn
      v-if="!authStore.isAuthenticated"
      href="/api/auth/github"
      prepend-icon="mdi-github"
    >
      Entrar com o GitHub
    </v-btn>

    <div v-else class="d-flex align-center">
      <v-avatar :image="authStore.user?.avatarUrl" size="36" class="mr-3"></v-avatar>
      <span class="mr-3">{{ authStore.user?.name }}</span>
      <v-btn icon @click="authStore.logout()" title="Sair">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
</script>
