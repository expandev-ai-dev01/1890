import { z } from 'zod';

export const goalSchema = z
  .object({
    goalName: z
      .string('Nome do objetivo é obrigatório')
      .min(3, 'Nome deve ter no mínimo 3 caracteres')
      .max(100, 'Nome deve ter no máximo 100 caracteres'),
    startDate: z
      .string('Data de início é obrigatória')
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato AAAA-MM-DD'),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato AAAA-MM-DD')
      .optional(),
    caloriesTarget: z
      .number('Meta de calorias é obrigatória')
      .positive('Meta deve ser maior que zero')
      .max(10000, 'Meta deve ser no máximo 10.000'),
    proteinTarget: z.number().min(0, 'Meta deve ser maior ou igual a zero').optional(),
    carbsTarget: z.number().min(0, 'Meta deve ser maior ou igual a zero').optional(),
    fatTarget: z.number().min(0, 'Meta deve ser maior ou igual a zero').optional(),
    fiberTarget: z.number().min(0, 'Meta deve ser maior ou igual a zero').optional(),
    macroType: z.enum(['grams', 'percentage'], 'Tipo de meta inválido'),
    active: z.boolean().optional(),
    notes: z.string().max(500, 'Observações devem ter no máximo 500 caracteres').optional(),
  })
  .refine(
    (data) => {
      if (data.endDate && data.startDate) {
        return new Date(data.endDate) >= new Date(data.startDate);
      }
      return true;
    },
    {
      message: 'Data de término deve ser posterior à data de início',
      path: ['endDate'],
    }
  );
