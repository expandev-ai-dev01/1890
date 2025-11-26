/**
 * @summary
 * Internal API routes configuration for authenticated endpoints.
 * Handles all authenticated user operations and protected resources.
 *
 * @module routes/v1/internalRoutes
 */

import { Router } from 'express';
import * as mealController from '@/api/v1/internal/meal/controller';
import * as mealFoodController from '@/api/v1/internal/meal-food/controller';
import * as foodController from '@/api/v1/internal/food/controller';
import * as goalController from '@/api/v1/internal/goal/controller';
import * as recipeController from '@/api/v1/internal/recipe/controller';
import * as dashboardController from '@/api/v1/internal/dashboard/controller';

const router = Router();

router.post('/meal', mealController.postHandler);
router.get('/meal', mealController.listHandler);
router.get('/meal/:id', mealController.getHandler);
router.put('/meal/:id', mealController.putHandler);
router.delete('/meal/:id', mealController.deleteHandler);

router.post('/meal-food', mealFoodController.postHandler);
router.get('/meal-food', mealFoodController.listHandler);
router.put('/meal-food/:id', mealFoodController.putHandler);
router.delete('/meal-food/:id', mealFoodController.deleteHandler);

router.get('/food', foodController.listHandler);
router.get('/food/:id', foodController.getHandler);

router.post('/goal', goalController.postHandler);
router.get('/goal', goalController.listHandler);
router.get('/goal/:id', goalController.getHandler);
router.put('/goal/:id', goalController.putHandler);

router.post('/recipe', recipeController.postHandler);
router.get('/recipe', recipeController.listHandler);
router.get('/recipe/:id', recipeController.getHandler);
router.put('/recipe/:id', recipeController.putHandler);
router.delete('/recipe/:id', recipeController.deleteHandler);

router.get('/dashboard', dashboardController.getHandler);

export default router;
