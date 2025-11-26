/**
 * @summary
 * Meal food business logic implementation.
 * Handles food items within meals with nutritional calculations.
 *
 * @module services/mealFood/mealFoodLogic
 */

import { v4 as uuidv4 } from 'uuid';
import { MealFood, MealFoodCreateInput, MealFoodUpdateInput } from './mealFoodTypes';
import { foodGet } from '@/services/food';
import { recipeGet } from '@/services/recipe';
import { mealGet } from '@/services/meal';

const mealFoods: MealFood[] = [];

/**
 * @summary
 * Calculates nutritional values based on quantity
 */
function calculateNutrition(baseValues: any, quantity: number, unit: string): any {
  const factor = quantity / 100;

  return {
    calories: baseValues.calories * factor,
    protein: baseValues.protein * factor,
    carbs: baseValues.carbs * factor,
    fat: baseValues.fat * factor,
    fiber: baseValues.fiber * factor,
  };
}

/**
 * @summary
 * Adds a food item or recipe to a meal
 */
export async function mealFoodCreate(input: MealFoodCreateInput): Promise<MealFood> {
  /**
   * @validation Verify meal exists
   * @throw {MEAL_NOT_FOUND}
   */
  const meal = await mealGet(input.mealId);
  if (!meal) {
    throw new Error('MEAL_NOT_FOUND');
  }

  let itemType: 'food' | 'recipe' = 'food';
  let nutritionData: any;

  if (input.foodId) {
    /**
     * @validation Verify food exists
     * @throw {FOOD_NOT_FOUND}
     */
    const food = await foodGet(input.foodId);
    if (!food) {
      throw new Error('FOOD_NOT_FOUND');
    }
    nutritionData = calculateNutrition(food, input.quantity, input.unit);
  } else if (input.recipeId) {
    /**
     * @validation Verify recipe exists
     * @throw {RECIPE_NOT_FOUND}
     */
    const recipe = await recipeGet(input.recipeId);
    if (!recipe) {
      throw new Error('RECIPE_NOT_FOUND');
    }
    itemType = 'recipe';
    nutritionData = calculateNutrition(recipe.nutritionPerServing, input.quantity, input.unit);
  }

  const mealFood: MealFood = {
    id: uuidv4(),
    mealId: input.mealId,
    foodId: input.foodId || null,
    recipeId: input.recipeId || null,
    quantity: input.quantity,
    unit: input.unit,
    calculatedCalories: nutritionData.calories,
    calculatedProtein: nutritionData.protein,
    calculatedCarbs: nutritionData.carbs,
    calculatedFat: nutritionData.fat,
    calculatedFiber: nutritionData.fiber,
    observation: input.observation || null,
    itemType,
  };

  mealFoods.push(mealFood);
  return mealFood;
}

/**
 * @summary
 * Lists all food items in a meal
 */
export async function mealFoodList(mealId: string): Promise<MealFood[]> {
  return mealFoods.filter((mf) => mf.mealId === mealId);
}

/**
 * @summary
 * Updates a meal food item
 */
export async function mealFoodUpdate(
  id: string,
  input: MealFoodUpdateInput
): Promise<MealFood | null> {
  const index = mealFoods.findIndex((mf) => mf.id === id);

  if (index === -1) {
    return null;
  }

  const current = mealFoods[index];
  let nutritionData = {
    calories: current.calculatedCalories,
    protein: current.calculatedProtein,
    carbs: current.calculatedCarbs,
    fat: current.calculatedFat,
    fiber: current.calculatedFiber,
  };

  if (input.quantity || input.unit) {
    const quantity = input.quantity || current.quantity;
    const unit = input.unit || current.unit;

    if (current.foodId) {
      const food = await foodGet(current.foodId);
      if (food) {
        nutritionData = calculateNutrition(food, quantity, unit);
      }
    } else if (current.recipeId) {
      const recipe = await recipeGet(current.recipeId);
      if (recipe) {
        nutritionData = calculateNutrition(recipe.nutritionPerServing, quantity, unit);
      }
    }
  }

  mealFoods[index] = {
    ...current,
    quantity: input.quantity || current.quantity,
    unit: input.unit || current.unit,
    observation: input.observation !== undefined ? input.observation : current.observation,
    calculatedCalories: nutritionData.calories,
    calculatedProtein: nutritionData.protein,
    calculatedCarbs: nutritionData.carbs,
    calculatedFat: nutritionData.fat,
    calculatedFiber: nutritionData.fiber,
  };

  return mealFoods[index];
}

/**
 * @summary
 * Removes a food item from a meal
 */
export async function mealFoodDelete(id: string): Promise<boolean> {
  const index = mealFoods.findIndex((mf) => mf.id === id);

  if (index === -1) {
    return false;
  }

  mealFoods.splice(index, 1);
  return true;
}
