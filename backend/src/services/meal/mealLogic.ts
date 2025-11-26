/**
 * @summary
 * Meal business logic implementation.
 * Handles meal CRUD operations with in-memory storage.
 *
 * @module services/meal/mealLogic
 */

import { v4 as uuidv4 } from 'uuid';
import { Meal, MealCreateInput, MealUpdateInput, MealListQuery } from './mealTypes';

const meals: Meal[] = [];

/**
 * @summary
 * Creates a new meal
 */
export async function mealCreate(input: MealCreateInput): Promise<Meal> {
  const meal: Meal = {
    id: uuidv4(),
    userId: input.userId,
    mealName: input.mealName,
    mealDate: input.mealDate,
    mealTime: input.mealTime,
    description: input.description || null,
    location: input.location || null,
    registeredAt: new Date().toISOString(),
    tags: input.tags || [],
  };

  meals.push(meal);
  return meal;
}

/**
 * @summary
 * Lists meals with optional filtering
 */
export async function mealList(query: MealListQuery): Promise<Meal[]> {
  let filtered = meals.filter((m) => m.userId === query.userId);

  if (query.startDate) {
    filtered = filtered.filter((m) => m.mealDate >= query.startDate!);
  }

  if (query.endDate) {
    filtered = filtered.filter((m) => m.mealDate <= query.endDate!);
  }

  const page = query.page || 1;
  const limit = query.limit || 50;
  const start = (page - 1) * limit;
  const end = start + limit;

  return filtered.slice(start, end);
}

/**
 * @summary
 * Gets a specific meal by ID
 */
export async function mealGet(id: string): Promise<Meal | null> {
  return meals.find((m) => m.id === id) || null;
}

/**
 * @summary
 * Updates an existing meal
 */
export async function mealUpdate(id: string, input: MealUpdateInput): Promise<Meal | null> {
  const index = meals.findIndex((m) => m.id === id);

  if (index === -1) {
    return null;
  }

  meals[index] = {
    ...meals[index],
    ...input,
  };

  return meals[index];
}

/**
 * @summary
 * Deletes a meal
 */
export async function mealDelete(id: string): Promise<boolean> {
  const index = meals.findIndex((m) => m.id === id);

  if (index === -1) {
    return false;
  }

  meals.splice(index, 1);
  return true;
}
