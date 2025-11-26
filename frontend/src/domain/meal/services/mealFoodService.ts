import { authenticatedClient } from '@/core/lib/api';
import type { MealFood, CreateMealFoodDto, UpdateMealFoodDto } from '../types/mealFood';

/**
 * @service MealFoodService
 * @domain meal
 * @type REST
 */
export const mealFoodService = {
  /**
   * Adds a food item or recipe to a meal
   */
  async create(data: CreateMealFoodDto): Promise<MealFood> {
    const response = await authenticatedClient.post<{ data: MealFood }>('/meal-food', data);
    return response.data.data;
  },

  /**
   * Lists all food items in a meal
   */
  async list(mealId: string): Promise<MealFood[]> {
    const response = await authenticatedClient.get<{ data: MealFood[] }>('/meal-food', {
      params: { mealId },
    });
    return response.data.data;
  },

  /**
   * Updates a meal food item
   */
  async update(id: string, data: UpdateMealFoodDto): Promise<MealFood> {
    const response = await authenticatedClient.put<{ data: MealFood }>(`/meal-food/${id}`, data);
    return response.data.data;
  },

  /**
   * Removes a food item from a meal
   */
  async delete(id: string): Promise<void> {
    await authenticatedClient.delete(`/meal-food/${id}`);
  },
};
