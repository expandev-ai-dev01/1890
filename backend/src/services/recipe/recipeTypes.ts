/**
 * @summary
 * Recipe type definitions.
 *
 * @module services/recipe/recipeTypes
 */

export interface RecipeIngredient {
  foodId: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: string;
  userId: string;
  recipeName: string;
  description: string | null;
  category: string;
  servings: number;
  prepTime: number | null;
  ingredients: RecipeIngredient[];
  instructions: string | null;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  nutritionPerServing: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  isPublic: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RecipeCreateInput {
  userId: string;
  recipeName: string;
  description?: string | null;
  category: string;
  servings: number;
  prepTime?: number;
  ingredients: RecipeIngredient[];
  instructions?: string | null;
  isPublic?: boolean;
  tags?: string[];
}

export interface RecipeUpdateInput {
  recipeName?: string;
  description?: string | null;
  category?: string;
  servings?: number;
  prepTime?: number;
  ingredients?: RecipeIngredient[];
  instructions?: string | null;
  isPublic?: boolean;
  tags?: string[];
}

export interface RecipeListQuery {
  userId?: string;
  category?: string;
  query?: string;
  publicOnly?: boolean;
  limit?: number;
}
