import { authenticatedClient } from '@/core/lib/api';
import type { Meal, CreateMealDto, UpdateMealDto, MealListParams } from '../types/meal';

/**
 * @service MealService
 * @domain meal
 * @type REST
 */
export const mealService = {
  /**
   * Creates a new meal
   */
  async create(data: CreateMealDto): Promise<Meal> {
    const response = await authenticatedClient.post<{ data: Meal }>('/meal', data);
    return response.data.data;
  },

  /**
   * Lists meals with optional filters
   */
  async list(params: MealListParams): Promise<Meal[]> {
    const response = await authenticatedClient.get<{ data: Meal[] }>('/meal', { params });
    return response.data.data;
  },

  /**
   * Gets a specific meal by ID
   */
  async getById(id: string): Promise<Meal> {
    const response = await authenticatedClient.get<{ data: Meal }>(`/meal/${id}`);
    return response.data.data;
  },

  /**
   * Updates an existing meal
   */
  async update(id: string, data: UpdateMealDto): Promise<Meal> {
    const response = await authenticatedClient.put<{ data: Meal }>(`/meal/${id}`, data);
    return response.data.data;
  },

  /**
   * Deletes a meal
   */
  async delete(id: string): Promise<void> {
    await authenticatedClient.delete(`/meal/${id}`);
  },
};
