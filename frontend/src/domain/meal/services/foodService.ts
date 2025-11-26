import { authenticatedClient } from '@/core/lib/api';
import type { Food, FoodSearchParams } from '../types/food';

/**
 * @service FoodService
 * @domain meal
 * @type REST
 */
export const foodService = {
  /**
   * Searches for foods in the database
   */
  async search(params: FoodSearchParams): Promise<Food[]> {
    const response = await authenticatedClient.get<{ data: Food[] }>('/food', { params });
    return response.data.data;
  },

  /**
   * Gets detailed information about a specific food
   */
  async getById(id: string): Promise<Food> {
    const response = await authenticatedClient.get<{ data: Food }>(`/food/${id}`);
    return response.data.data;
  },
};
