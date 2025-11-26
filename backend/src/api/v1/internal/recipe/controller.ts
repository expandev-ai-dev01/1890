/**
 * @summary
 * Recipe management controller.
 * Handles CRUD operations for user recipes.
 *
 * @api {post} /api/v1/internal/recipe Create Recipe
 * @apiName CreateRecipe
 * @apiGroup Recipe
 * @apiVersion 1.0.0
 *
 * @api {get} /api/v1/internal/recipe List Recipes
 * @apiName ListRecipes
 * @apiGroup Recipe
 * @apiVersion 1.0.0
 *
 * @api {get} /api/v1/internal/recipe/:id Get Recipe
 * @apiName GetRecipe
 * @apiGroup Recipe
 * @apiVersion 1.0.0
 *
 * @api {put} /api/v1/internal/recipe/:id Update Recipe
 * @apiName UpdateRecipe
 * @apiGroup Recipe
 * @apiVersion 1.0.0
 *
 * @api {delete} /api/v1/internal/recipe/:id Delete Recipe
 * @apiName DeleteRecipe
 * @apiGroup Recipe
 * @apiVersion 1.0.0
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '@/utils/response';
import { recipeCreate, recipeList, recipeGet, recipeUpdate, recipeDelete } from '@/services/recipe';
import { zName, zNullableString } from '@/utils/validation';

const ingredientSchema = z.object({
  foodId: z.string().uuid(),
  quantity: z.number().positive(),
  unit: z.enum(['g', 'ml', 'unit', 'tablespoon', 'teaspoon', 'cup', 'slice', 'portion']),
});

const createBodySchema = z.object({
  userId: z.string().uuid(),
  recipeName: zName.max(100),
  description: zNullableString.optional(),
  category: z.enum(['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'beverage', 'other']),
  servings: z.number().int().positive().max(100),
  prepTime: z.number().int().positive().optional(),
  ingredients: z.array(ingredientSchema).min(1),
  instructions: zNullableString.optional(),
  isPublic: z.boolean().optional(),
  tags: z.array(z.string().max(20)).max(10).optional(),
});

const updateBodySchema = z.object({
  recipeName: zName.max(100).optional(),
  description: zNullableString.optional(),
  category: z
    .enum(['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'beverage', 'other'])
    .optional(),
  servings: z.number().int().positive().max(100).optional(),
  prepTime: z.number().int().positive().optional(),
  ingredients: z.array(ingredientSchema).min(1).optional(),
  instructions: zNullableString.optional(),
  isPublic: z.boolean().optional(),
  tags: z.array(z.string().max(20)).max(10).optional(),
});

const listQuerySchema = z.object({
  userId: z.string().uuid().optional(),
  category: z.string().optional(),
  query: z.string().optional(),
  publicOnly: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

const idParamSchema = z.object({
  id: z.string().uuid(),
});

/**
 * @summary
 * Creates a new recipe
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = createBodySchema.parse(req.body);

    const recipe = await recipeCreate(validated);
    res.status(201).json(successResponse(recipe));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
      return;
    }
    if (error.message === 'FOOD_NOT_FOUND') {
      res.status(404).json(errorResponse('One or more ingredients not found', 'FOOD_NOT_FOUND'));
      return;
    }
    next(error);
  }
}

/**
 * @summary
 * Lists recipes with optional filtering
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = listQuerySchema.parse(req.query);

    const recipes = await recipeList(validated);
    res.json(successResponse(recipes));
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
 * Gets a specific recipe by ID
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = idParamSchema.parse(req.params);

    const recipe = await recipeGet(id);

    if (!recipe) {
      res.status(404).json(errorResponse('Recipe not found', 'RECIPE_NOT_FOUND'));
      return;
    }

    res.json(successResponse(recipe));
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
 * Updates an existing recipe
 */
export async function putHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = idParamSchema.parse(req.params);
    const validated = updateBodySchema.parse(req.body);

    const recipe = await recipeUpdate(id, validated);

    if (!recipe) {
      res.status(404).json(errorResponse('Recipe not found', 'RECIPE_NOT_FOUND'));
      return;
    }

    res.json(successResponse(recipe));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
      return;
    }
    if (error.message === 'FOOD_NOT_FOUND') {
      res.status(404).json(errorResponse('One or more ingredients not found', 'FOOD_NOT_FOUND'));
      return;
    }
    next(error);
  }
}

/**
 * @summary
 * Deletes a recipe
 */
export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = idParamSchema.parse(req.params);

    const success = await recipeDelete(id);

    if (!success) {
      res.status(404).json(errorResponse('Recipe not found', 'RECIPE_NOT_FOUND'));
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
