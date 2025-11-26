/**
 * @summary
 * Meal type definitions.
 *
 * @module services/meal/mealTypes
 */

export interface Meal {
  id: string;
  userId: string;
  mealName: string;
  mealDate: string;
  mealTime: string;
  description: string | null;
  location: string | null;
  registeredAt: string;
  tags: string[];
}

export interface MealCreateInput {
  userId: string;
  mealName: string;
  mealDate: string;
  mealTime: string;
  description?: string | null;
  location?: string | null;
  tags?: string[];
}

export interface MealUpdateInput {
  mealName?: string;
  mealDate?: string;
  mealTime?: string;
  description?: string | null;
  location?: string | null;
  tags?: string[];
}

export interface MealListQuery {
  userId: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
