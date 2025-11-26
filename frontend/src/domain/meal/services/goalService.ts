import { authenticatedClient } from '@/core/lib/api';
import type { Goal, CreateGoalDto, UpdateGoalDto, GoalListParams } from '../types/goal';

/**
 * @service GoalService
 * @domain meal
 * @type REST
 */
export const goalService = {
  /**
   * Creates a new dietary goal
   */
  async create(data: CreateGoalDto): Promise<Goal> {
    const response = await authenticatedClient.post<{ data: Goal }>('/goal', data);
    return response.data.data;
  },

  /**
   * Lists user's dietary goals
   */
  async list(params: GoalListParams): Promise<Goal[]> {
    const response = await authenticatedClient.get<{ data: Goal[] }>('/goal', { params });
    return response.data.data;
  },

  /**
   * Gets a specific goal by ID
   */
  async getById(id: string): Promise<Goal> {
    const response = await authenticatedClient.get<{ data: Goal }>(`/goal/${id}`);
    return response.data.data;
  },

  /**
   * Updates an existing goal
   */
  async update(id: string, data: UpdateGoalDto): Promise<Goal> {
    const response = await authenticatedClient.put<{ data: Goal }>(`/goal/${id}`, data);
    return response.data.data;
  },
};
