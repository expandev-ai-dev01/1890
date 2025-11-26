/**
 * @summary
 * Food database management controller.
 * Handles food search and retrieval operations.
 *
 * @api {get} /api/v1/internal/food Search Foods
 * @apiName SearchFoods
 * @apiGroup Food
 * @apiVersion 1.0.0
 *
 * @api {get} /api/v1/internal/food/:id Get Food
 * @apiName GetFood
 * @apiGroup Food
 * @apiVersion 1.0.0
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '@/utils/response';
import { foodSearch, foodGet } from '@/services/food';

const searchQuerySchema = z.object({
  query: z.string().min(1).optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

const idParamSchema = z.object({
  id: z.string().uuid(),
});

/**
 * @summary
 * Searches for foods in the database
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = searchQuerySchema.parse(req.query);

    const foods = await foodSearch(validated);
    res.json(successResponse(foods));
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
 * Gets detailed information about a specific food
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = idParamSchema.parse(req.params);

    const food = await foodGet(id);

    if (!food) {
      res.status(404).json(errorResponse('Food not found', 'FOOD_NOT_FOUND'));
      return;
    }

    res.json(successResponse(food));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
      return;
    }
    next(error);
  }
}
