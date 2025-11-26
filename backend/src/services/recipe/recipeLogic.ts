/**
 * @summary
 * Recipe business logic implementation.
 * Manages composite recipes with automatic nutritional calculations.
 *
 * @module services/recipe/recipeLogic
 */

import { v4 as uuidv4 } from 'uuid';
import { Recipe, RecipeCreateInput, RecipeUpdateInput, RecipeListQuery } from './recipeTypes';
import { foodGet } from '@/services/food';

const recipes: Recipe[] = [];

/**
 * @summary
 * Calculates total nutrition from ingredients
 */
async function calculateRecipeNutrition(ingredients: any[]): Promise<any> {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalFiber = 0;

  for (const ingredient of ingredients) {
    /**
     * @validation Verify each ingredient exists
     * @throw {FOOD_NOT_FOUND}
     */
    const food = await foodGet(ingredient.foodId);
    if (!food) {
      throw new Error('FOOD_NOT_FOUND');
    }

    const factor = ingredient.quantity / 100;
    totalCalories += food.calories * factor;
    totalProtein += food.protein * factor;
    totalCarbs += food.carbs * factor;
    totalFat += food.fat * factor;
    totalFiber += food.fiber * factor;
  }

  return {
    calories: totalCalories,
    protein: totalProtein,
    carbs: totalCarbs,
    fat: totalFat,
    fiber: totalFiber,
  };
}

/**
 * @summary
 * Creates a new recipe
 */
export async function recipeCreate(input: RecipeCreateInput): Promise<Recipe> {
  const totalNutrition = await calculateRecipeNutrition(input.ingredients);

  const nutritionPerServing = {
    calories: totalNutrition.calories / input.servings,
    protein: totalNutrition.protein / input.servings,
    carbs: totalNutrition.carbs / input.servings,
    fat: totalNutrition.fat / input.servings,
    fiber: totalNutrition.fiber / input.servings,
  };

  const recipe: Recipe = {
    id: uuidv4(),
    userId: input.userId,
    recipeName: input.recipeName,
    description: input.description || null,
    category: input.category,
    servings: input.servings,
    prepTime: input.prepTime || null,
    ingredients: input.ingredients,
    instructions: input.instructions || null,
    totalCalories: totalNutrition.calories,
    totalProtein: totalNutrition.protein,
    totalCarbs: totalNutrition.carbs,
    totalFat: totalNutrition.fat,
    totalFiber: totalNutrition.fiber,
    nutritionPerServing,
    isPublic: input.isPublic || false,
    tags: input.tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  recipes.push(recipe);
  return recipe;
}

/**
 * @summary
 * Lists recipes with optional filtering
 */
export async function recipeList(query: RecipeListQuery): Promise<Recipe[]> {
  let filtered = recipes;

  if (query.userId) {
    filtered = filtered.filter((r) => r.userId === query.userId || r.isPublic);
  } else if (query.publicOnly) {
    filtered = filtered.filter((r) => r.isPublic);
  }

  if (query.category) {
    filtered = filtered.filter((r) => r.category === query.category);
  }

  if (query.query) {
    const searchTerm = query.query.toLowerCase();
    filtered = filtered.filter((r) => r.recipeName.toLowerCase().includes(searchTerm));
  }

  const limit = query.limit || 50;
  return filtered.slice(0, limit);
}

/**
 * @summary
 * Gets a specific recipe by ID
 */
export async function recipeGet(id: string): Promise<Recipe | null> {
  return recipes.find((r) => r.id === id) || null;
}

/**
 * @summary
 * Updates an existing recipe
 */
export async function recipeUpdate(id: string, input: RecipeUpdateInput): Promise<Recipe | null> {
  const index = recipes.findIndex((r) => r.id === id);

  if (index === -1) {
    return null;
  }

  const current = recipes[index];
  const ingredients = input.ingredients || current.ingredients;
  const servings = input.servings || current.servings;

  let totalNutrition = {
    calories: current.totalCalories,
    protein: current.totalProtein,
    carbs: current.totalCarbs,
    fat: current.totalFat,
    fiber: current.totalFiber,
  };

  if (input.ingredients) {
    totalNutrition = await calculateRecipeNutrition(ingredients);
  }

  const nutritionPerServing = {
    calories: totalNutrition.calories / servings,
    protein: totalNutrition.protein / servings,
    carbs: totalNutrition.carbs / servings,
    fat: totalNutrition.fat / servings,
    fiber: totalNutrition.fiber / servings,
  };

  recipes[index] = {
    ...current,
    ...input,
    ingredients,
    servings,
    totalCalories: totalNutrition.calories,
    totalProtein: totalNutrition.protein,
    totalCarbs: totalNutrition.carbs,
    totalFat: totalNutrition.fat,
    totalFiber: totalNutrition.fiber,
    nutritionPerServing,
    updatedAt: new Date().toISOString(),
  };

  return recipes[index];
}

/**
 * @summary
 * Deletes a recipe
 */
export async function recipeDelete(id: string): Promise<boolean> {
  const index = recipes.findIndex((r) => r.id === id);

  if (index === -1) {
    return false;
  }

  recipes.splice(index, 1);
  return true;
}
