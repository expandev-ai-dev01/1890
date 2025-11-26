export interface MealFood {
  id: string;
  mealId: string;
  foodId?: string;
  recipeId?: string;
  quantity: number;
  unit: 'g' | 'ml' | 'unit' | 'tablespoon' | 'teaspoon' | 'cup' | 'slice' | 'portion';
  observation?: string;
  calculatedCalories: number;
  calculatedProtein: number;
  calculatedCarbs: number;
  calculatedFat: number;
  calculatedFiber: number;
  itemType: 'food' | 'recipe';
}

export interface CreateMealFoodDto {
  mealId: string;
  foodId?: string;
  recipeId?: string;
  quantity: number;
  unit: 'g' | 'ml' | 'unit' | 'tablespoon' | 'teaspoon' | 'cup' | 'slice' | 'portion';
  observation?: string;
}

export interface UpdateMealFoodDto {
  quantity?: number;
  unit?: 'g' | 'ml' | 'unit' | 'tablespoon' | 'teaspoon' | 'cup' | 'slice' | 'portion';
  observation?: string;
}
