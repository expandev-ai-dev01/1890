/**
 * @summary
 * Dietary goal management controller.
 * Handles CRUD operations for user dietary goals.
 *
 * @api {post} /api/v1/internal/goal Create Goal
 * @apiName CreateGoal
 * @apiGroup Goal
 * @apiVersion 1.0.0
 *
 * @api {get} /api/v1/internal/goal List Goals
 * @apiName ListGoals
 * @apiGroup Goal
 * @apiVersion 1.0.0
 *
 * @api {get} /api/v1/internal/goal/:id Get Goal
 * @apiName GetGoal
 * @apiGroup Goal
 * @apiVersion 1.0.0
 *
 * @api {put} /api/v1/internal/goal/:id Update Goal
 * @apiName UpdateGoal
 * @apiGroup Goal
 * @apiVersion 1.0.0
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '@/utils/response';
import { goalCreate, goalList, goalGet, goalUpdate } from '@/services/goal';
import { zName, zNullableString } from '@/utils/validation';

const createBodySchema = z
  .object({
    userId: z.string().uuid(),
    goalName: zName.max(100),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    caloriesTarget: z.number().positive().max(10000),
    proteinTarget: z.number().min(0).optional(),
    carbsTarget: z.number().min(0).optional(),
    fatTarget: z.number().min(0).optional(),
    fiberTarget: z.number().min(0).optional(),
    macroType: z.enum(['grams', 'percentage']),
    active: z.boolean().optional(),
    notes: zNullableString.optional(),
  })
  .refine(
    (data) => {
      if (data.endDate) {
        return new Date(data.endDate) >= new Date(data.startDate);
      }
      return true;
    },
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    }
  );

const updateBodySchema = z.object({
  goalName: zName.max(100).optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  caloriesTarget: z.number().positive().max(10000).optional(),
  proteinTarget: z.number().min(0).optional(),
  carbsTarget: z.number().min(0).optional(),
  fatTarget: z.number().min(0).optional(),
  fiberTarget: z.number().min(0).optional(),
  macroType: z.enum(['grams', 'percentage']).optional(),
  active: z.boolean().optional(),
  notes: zNullableString.optional(),
});

const listQuerySchema = z.object({
  userId: z.string().uuid(),
  activeOnly: z.coerce.boolean().optional(),
});

const idParamSchema = z.object({
  id: z.string().uuid(),
});

/**
 * @summary
 * Creates a new dietary goal
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = createBodySchema.parse(req.body);

    const goal = await goalCreate(validated);
    res.status(201).json(successResponse(goal));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
      return;
    }
    next(error);
  }
}

/**
 * @summary
 * Lists user's dietary goals
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = listQuerySchema.parse(req.query);

    const goals = await goalList(validated);
    res.json(successResponse(goals));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
      return;
    }
    next(error);
  }
}

/**
 * @summary
 * Gets a specific goal by ID
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = idParamSchema.parse(req.params);

    const goal = await goalGet(id);

    if (!goal) {
      res.status(404).json(errorResponse('Goal not found', 'GOAL_NOT_FOUND'));
      return;
    }

    res.json(successResponse(goal));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
      return;
    }
    next(error);
  }
}

/**
 * @summary
 * Updates an existing goal
 */
export async function putHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = idParamSchema.parse(req.params);
    const validated = updateBodySchema.parse(req.body);

    const goal = await goalUpdate(id, validated);

    if (!goal) {
      res.status(404).json(errorResponse('Goal not found', 'GOAL_NOT_FOUND'));
      return;
    }

    res.json(successResponse(goal));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
      return;
    }
    next(error);
  }
}
