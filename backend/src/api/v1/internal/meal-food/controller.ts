/**
 * @summary
 * Meal food item management controller.
 * Handles adding, updating, and removing food items from meals.
 *
 * @api {post} /api/v1/internal/meal-food Create Meal Food Item
 * @apiName CreateMealFood
 * @apiGroup MealFood
 * @apiVersion 1.0.0
 *
 * @api {get} /api/v1/internal/meal-food List Meal Food Items
 * @apiName ListMealFoods
 * @apiGroup MealFood
 * @apiVersion 1.0.0
 *
 * @api {put} /api/v1/internal/meal-food/:id Update Meal Food Item
 * @apiName UpdateMealFood
 * @apiGroup MealFood
 * @apiVersion 1.0.0
 *
 * @api {delete} /api/v1/internal/meal-food/:id Delete Meal Food Item
 * @apiName DeleteMealFood
 * @apiGroup MealFood
 * @apiVersion 1.0.0
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '@/utils/response';
import { mealFoodCreate, mealFoodList, mealFoodUpdate, mealFoodDelete } from '@/services/mealFood';
import { zNullableString } from '@/utils/validation';

const createBodySchema = z
  .object({
    mealId: z.string().uuid(),
    foodId: z.string().uuid().optional(),
    recipeId: z.string().uuid().optional(),
    quantity: z.number().positive(),
    unit: z.enum(['g', 'ml', 'unit', 'tablespoon', 'teaspoon', 'cup', 'slice', 'portion']),
    observation: zNullableString.optional(),
  })
  .refine((data) => data.foodId || data.recipeId, {
    message: 'Either foodId or recipeId must be provided',
  });

const updateBodySchema = z.object({
  quantity: z.number().positive().optional(),
  unit: z.enum(['g', 'ml', 'unit', 'tablespoon', 'teaspoon', 'cup', 'slice', 'portion']).optional(),
  observation: zNullableString.optional(),
});

const listQuerySchema = z.object({
  mealId: z.string().uuid(),
});

const idParamSchema = z.object({
  id: z.string().uuid(),
});

/**
 * @summary
 * Adds a food item or recipe to a meal
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = createBodySchema.parse(req.body);

    const mealFood = await mealFoodCreate(validated);
    res.status(201).json(successResponse(mealFood));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
      return;
    }
    if (error.message === 'MEAL_NOT_FOUND') {
      res.status(404).json(errorResponse('Meal not found', 'MEAL_NOT_FOUND'));
      return;
    }
    if (error.message === 'FOOD_NOT_FOUND') {
      res.status(404).json(errorResponse('Food not found', 'FOOD_NOT_FOUND'));
      return;
    }
    if (error.message === 'RECIPE_NOT_FOUND') {
      res.status(404).json(errorResponse('Recipe not found', 'RECIPE_NOT_FOUND'));
      return;
    }
    next(error);
  }
}

/**
 * @summary
 * Lists all food items in a meal
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = listQuerySchema.parse(req.query);

    const mealFoods = await mealFoodList(validated.mealId);
    res.json(successResponse(mealFoods));
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
 * Updates a meal food item
 */
export async function putHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = idParamSchema.parse(req.params);
    const validated = updateBodySchema.parse(req.body);

    const mealFood = await mealFoodUpdate(id, validated);

    if (!mealFood) {
      res.status(404).json(errorResponse('Meal food item not found', 'MEAL_FOOD_NOT_FOUND'));
      return;
    }

    res.json(successResponse(mealFood));
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
 * Removes a food item from a meal
 */
export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = idParamSchema.parse(req.params);

    const success = await mealFoodDelete(id);

    if (!success) {
      res.status(404).json(errorResponse('Meal food item not found', 'MEAL_FOOD_NOT_FOUND'));
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
