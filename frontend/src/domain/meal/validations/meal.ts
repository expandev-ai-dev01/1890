import { z } from 'zod';

export const mealSchema = z.object({
  mealName: z
    .string('Nome da refeição é obrigatório')
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
  mealDate: z
    .string('Data é obrigatória')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato AAAA-MM-DD'),
  mealTime: z
    .string('Horário é obrigatório')
    .regex(/^\d{2}:\d{2}$/, 'Horário deve estar no formato HH:MM'),
  description: z.string().max(500, 'Descrição deve ter no máximo 500 caracteres').optional(),
  location: z.string().max(100, 'Local deve ter no máximo 100 caracteres').optional(),
  tags: z
    .array(z.string().max(20, 'Tag deve ter no máximo 20 caracteres'))
    .max(10, 'Máximo de 10 tags')
    .optional(),
});
