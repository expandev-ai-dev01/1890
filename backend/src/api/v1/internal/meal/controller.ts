/**
 * @summary
 * Meal management controller for DietaTracker.
 * Handles CRUD operations for meal records.
 *
 * @api {post} /api/v1/internal/meal Create Meal
 * @apiName CreateMeal
 * @apiGroup Meal
 * @apiVersion 1.0.0
 *
 * @api {get} /api/v1/internal/meal List Meals
 * @apiName ListMeals
 * @apiGroup Meal
 * @apiVersion 1.0.0
 *
 * @api {get} /api/v1/internal/meal/:id Get Meal
 * @apiName GetMeal
 * @apiGroup Meal
 * @apiVersion 1.0.0
 *
 * @api {put} /api/v1/internal/meal/:id Update Meal
 * @apiName UpdateMeal
 * @apiGroup Meal
 * @apiVersion 1.0.0
 *
 * @api {delete} /api/v1/internal/meal/:id Delete Meal
 * @apiName DeleteMeal
 * @apiGroup Meal
 * @apiVersion 1.0.0
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '@/utils/response';
import { mealCreate, mealList, mealGet, mealUpdate, mealDelete } from '@/services/meal';
import { zName, zNullableString } from '@/utils/validation';

const createBodySchema = z.object({
  userId: z.string().uuid(),
  mealName: zName.max(50),
  mealDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  mealTime: z.string().regex(/^\d{2}:\d{2}$/),
  description: zNullableString.optional(),
  location: zNullableString.optional(),
  tags: z.array(z.string().max(20)).max(10).optional(),
});

const updateBodySchema = z.object({
  mealName: zName.max(50).optional(),
  mealDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  mealTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .optional(),
  description: zNullableString.optional(),
  location: zNullableString.optional(),
  tags: z.array(z.string().max(20)).max(10).optional(),
});

const listQuerySchema = z.object({
  userId: z.string().uuid(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

const idParamSchema = z.object({
  id: z.string().uuid(),
});

/**
 * @summary
 * Creates a new meal record
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = createBodySchema.parse(req.body);

    /**
     * @validation Validate meal date is not in the future
     * @throw {dateInFuture}
     */
    const mealDate = new Date(validated.mealDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (mealDate > today) {
      res.status(400).json(errorResponse('Meal date cannot be in the future', 'DATE_IN_FUTURE'));
      return;
    }

    const meal = await mealCreate(validated);
    res.status(201).json(successResponse(meal));
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
 * Lists meals with optional filtering
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = listQuerySchema.parse(req.query);

    const meals = await mealList(validated);
    res.json(successResponse(meals));
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
 * Gets a specific meal by ID
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = idParamSchema.parse(req.params);

    const meal = await mealGet(id);

    if (!meal) {
      res.status(404).json(errorResponse('Meal not found', 'MEAL_NOT_FOUND'));
      return;
    }

    res.json(successResponse(meal));
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
 * Updates an existing meal
 */
export async function putHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = idParamSchema.parse(req.params);
    const validated = updateBodySchema.parse(req.body);

    /**
     * @validation Validate meal date is not in the future if provided
     * @throw {dateInFuture}
     */
    if (validated.mealDate) {
      const mealDate = new Date(validated.mealDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (mealDate > today) {
        res.status(400).json(errorResponse('Meal date cannot be in the future', 'DATE_IN_FUTURE'));
        return;
      }
    }

    const meal = await mealUpdate(id, validated);

    if (!meal) {
      res.status(404).json(errorResponse('Meal not found', 'MEAL_NOT_FOUND'));
      return;
    }

    res.json(successResponse(meal));
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
 * Deletes a meal
 */
export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = idParamSchema.parse(req.params);

    const success = await mealDelete(id);

    if (!success) {
      res.status(404).json(errorResponse('Meal not found', 'MEAL_NOT_FOUND'));
      return;
    }

    res.json(successResponse({ deleted: true }));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
      return;
    }
    next(error);
  }
}
