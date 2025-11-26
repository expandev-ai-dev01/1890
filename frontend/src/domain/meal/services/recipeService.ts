import { authenticatedClient } from '@/core/lib/api';
import type { Recipe, CreateRecipeDto, UpdateRecipeDto, RecipeSearchParams } from '../types/recipe';

/**
 * @service RecipeService
 * @domain meal
 * @type REST
 */
export const recipeService = {
  /**
   * Creates a new recipe
   */
  async create(data: CreateRecipeDto): Promise<Recipe> {
    const response = await authenticatedClient.post<{ data: Recipe }>('/recipe', data);
    return response.data.data;
  },

  /**
   * Lists recipes with optional filtering
   */
  async list(params: RecipeSearchParams): Promise<Recipe[]> {
    const response = await authenticatedClient.get<{ data: Recipe[] }>('/recipe', { params });
    return response.data.data;
  },

  /**
   * Gets a specific recipe by ID
   */
  async getById(id: string): Promise<Recipe> {
    const response = await authenticatedClient.get<{ data: Recipe }>(`/recipe/${id}`);
    return response.data.data;
  },

  /**
   * Updates an existing recipe
   */
  async update(id: string, data: UpdateRecipeDto): Promise<Recipe> {
    const response = await authenticatedClient.put<{ data: Recipe }>(`/recipe/${id}`, data);
    return response.data.data;
  },

  /**
   * Deletes a recipe
   */
  async delete(id: string): Promise<void> {
    await authenticatedClient.delete(`/recipe/${id}`);
  },
};
