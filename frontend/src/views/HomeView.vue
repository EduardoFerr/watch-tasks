<template>
  <v-container>
    <v-row>
      <v-col>
        <!-- Componente de formulário -->
        <TaskForm />

        <h1 class="text-h4 font-weight-bold mb-4">Minhas Tarefas ({{ taskStore.totalTasks }})</h1>


        <!-- Lista de tarefas -->
        <v-card v-if="taskStore.tasks.length > 0" flat border>
          <v-list lines="two">
            <v-list-item
              v-for="task in taskStore.tasks"
              :key="task.id"
              :title="task.title"
              :subtitle="task.description || 'Sem descrição'"
              :class="{ 'text-decoration-line-through text-medium-emphasis': task.status === 'DONE' }"
            >
              <template v-slot:append>
                <div class="d-flex align-center">
                  <v-chip
                    :color="task.status === 'DONE' ? 'green' : 'orange'"
                    size="small"
                    variant="tonal"
                    class="mr-4"
                  >
                    {{ task.status }}
                  </v-chip>
                  
                  <v-btn
                    v-if="task.status !== 'DONE'"
                    icon="mdi-check"
                    variant="text"
                    size="small"
                    @click="markAsDone(task.id)"
                    title="Marcar como concluída"
                  ></v-btn>

                  <v-btn
                    icon="mdi-delete-outline"
                    variant="text"
                    color="grey"
                    size="small"
                    @click="promptDelete(task.id)"
                    title="Apagar tarefa"
                  ></v-btn>
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
        

      </v-col>
    </v-row>

    <ConfirmationDialog
      v-model:show="isDialogVisible"
      title="Apagar Tarefa"
      message="Tem a certeza de que quer apagar esta tarefa? Esta ação não pode ser desfeita."
      confirm-color="red"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />

  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useTaskStore } from '@/stores/taskStore';
import TaskForm from '@/components/TaskForm.vue';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'; // <-- Importa o novo componente
import { Status } from '@/types';

const taskStore = useTaskStore();

const isDialogVisible = ref(false);
const taskToDeleteId = ref<string | null>(null);

const markAsDone = (id: string) => {
  taskStore.updateTask(id, { status: Status.DONE });
};

const promptDelete = (id: string) => {
  taskToDeleteId.value = id; // Guarda o ID da tarefa a ser apagada
  isDialogVisible.value = true; // Abre o diálogo
};

const confirmDelete = () => {
  if (taskToDeleteId.value) {
    taskStore.deleteTask(taskToDeleteId.value);
  }
  isDialogVisible.value = false; // Fecha o diálogo
  taskToDeleteId.value = null; // Limpa o ID
};

const cancelDelete = () => {
  isDialogVisible.value = false; // Apenas fecha o diálogo
  taskToDeleteId.value = null; // Limpa o ID
};

onMounted(() => {
  if (taskStore.tasks.length === 0) {
    taskStore.fetchTasks();
  }
});
</script>
