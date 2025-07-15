<template>
  <v-card flat border class="mb-8">
    <v-card-title>Criar Nova Tarefa</v-card-title>
    <v-card-text>
      <v-alert
        v-if="submissionError"
        type="error"
        variant="tonal"
        class="mb-4"
        closable
        @click:close="submissionError = null"
      >
        {{ submissionError }}
      </v-alert>

      <v-form @submit.prevent="handleSubmit">
        <v-text-field
          v-model="title"
          label="Título da Tarefa"
          variant="outlined"
          density="compact"
          :error-messages="errors.title"
          @input="errors.title = []"
        ></v-text-field>

        <v-textarea
          v-model="description"
          label="Descrição (Opcional)"
          variant="outlined"
          density="compact"
          class="mt-4"
        ></v-textarea>

        <v-btn
          type="submit"
          color="primary"
          :loading="loading"
          :disabled="loading"
        >
          Adicionar Tarefa
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useTaskStore } from '@/stores/taskStore';
import { TaskCreateSchema } from '@/types';

const taskStore = useTaskStore();

const title = ref('');
const description = ref('');
const loading = ref(false);
const errors = ref<{ title?: string[] }>({});
const submissionError = ref<string | null>(null);

const handleSubmit = async () => {
  console.log('1. A função handleSubmit foi chamada.');
  
  loading.value = true;
  errors.value = {};
  submissionError.value = null;

  const taskData = {
    title: title.value,
    description: description.value || null,
    authorId: 'user-123',
  };
  console.log('2. Dados do formulário a serem validados:', taskData);

  const validation = TaskCreateSchema.safeParse(taskData);
  console.log('3. Resultado da validação Zod:', validation);

  if (!validation.success) {
    console.error('4. Validação falhou. Mostrando erros.');
    errors.value = validation.error.flatten().fieldErrors;
    loading.value = false;
    return;
  }

  console.log('5. Validação bem-sucedida. Chamando a action da store...');
  await taskStore.createTask(validation.data);
  
  console.log('6. Action da store concluída. Verificando se há erros.');
  if (taskStore.error) {
    console.error('7. Erro encontrado na store:', taskStore.error);
    submissionError.value = taskStore.error;
  } else {
    console.log('8. Sucesso! Limpando o formulário.');
    title.value = '';
    description.value = '';
  }

  loading.value = false;
  console.log('9. A função handleSubmit foi concluída.');
};
</script>
