export interface RecipeIngredient {
  foodId: string;
  quantity: number;
  unit: 'g' | 'ml' | 'unit' | 'tablespoon' | 'teaspoon' | 'cup' | 'slice' | 'portion';
}

export interface Recipe {
  id: string;
  userId: string;
  recipeName: string;
  description?: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert' | 'beverage' | 'other';
  servings: number;
  prepTime?: number;
  ingredients: RecipeIngredient[];
  instructions?: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  totalMicronutrients?: Record<string, number>;
  perServingValues: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  isPublic: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecipeDto {
  userId: string;
  recipeName: string;
  description?: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert' | 'beverage' | 'other';
  servings: number;
  prepTime?: number;
  ingredients: RecipeIngredient[];
  instructions?: string;
  isPublic?: boolean;
  tags?: string[];
}

export interface UpdateRecipeDto {
  recipeName?: string;
  description?: string;
  category?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert' | 'beverage' | 'other';
  servings?: number;
  prepTime?: number;
  ingredients?: RecipeIngredient[];
  instructions?: string;
  isPublic?: boolean;
  tags?: string[];
}

export interface RecipeSearchParams {
  userId?: string;
  category?: string;
  query?: string;
  publicOnly?: boolean;
  limit?: number;
}
