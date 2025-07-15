import { z } from 'zod';

export enum Status {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  ARCHIVED = 'ARCHIVED',
}

export const StatusSchema = z.nativeEnum(Status);

export const TaskSchema = z.object({
  id: z.string().cuid(),
  title: z.string(),
  description: z.string().nullable(),
  status: StatusSchema, // Agora usa o schema baseado no enum
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  authorId: z.string().min(1),
  categoryId: z.string().cuid().nullable(),
});

export const TaskCreateSchema = TaskSchema.pick({
  title: true,
  description: true,
  authorId: true,
});


export const TaskUpdateSchema = TaskSchema.pick({
  title: true,
  description: true,
  status: true,
}).partial(); 


export type Task = z.infer<typeof TaskSchema>;
export type TaskCreatePayload = z.infer<typeof TaskCreateSchema>;
export type TaskUpdatePayload = z.infer<typeof TaskUpdateSchema>;
