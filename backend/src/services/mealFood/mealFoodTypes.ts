/**
 * @summary
 * Meal food type definitions.
 *
 * @module services/mealFood/mealFoodTypes
 */

export interface MealFood {
  id: string;
  mealId: string;
  foodId: string | null;
  recipeId: string | null;
  quantity: number;
  unit: string;
  calculatedCalories: number;
  calculatedProtein: number;
  calculatedCarbs: number;
  calculatedFat: number;
  calculatedFiber: number;
  observation: string | null;
  itemType: 'food' | 'recipe';
}

export interface MealFoodCreateInput {
  mealId: string;
  foodId?: string;
  recipeId?: string;
  quantity: number;
  unit: string;
  observation?: string | null;
}

export interface MealFoodUpdateInput {
  quantity?: number;
  unit?: string;
  observation?: string | null;
}
