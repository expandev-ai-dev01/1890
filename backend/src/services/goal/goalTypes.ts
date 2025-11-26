/**
 * @summary
 * Goal type definitions.
 *
 * @module services/goal/goalTypes
 */

export interface Goal {
  id: string;
  userId: string;
  goalName: string;
  startDate: string;
  endDate: string | null;
  caloriesTarget: number;
  proteinTarget: number | null;
  carbsTarget: number | null;
  fatTarget: number | null;
  fiberTarget: number | null;
  macroType: 'grams' | 'percentage';
  active: boolean;
  notes: string | null;
}

export interface GoalCreateInput {
  userId: string;
  goalName: string;
  startDate: string;
  endDate?: string;
  caloriesTarget: number;
  proteinTarget?: number;
  carbsTarget?: number;
  fatTarget?: number;
  fiberTarget?: number;
  macroType: 'grams' | 'percentage';
  active?: boolean;
  notes?: string | null;
}

export interface GoalUpdateInput {
  goalName?: string;
  startDate?: string;
  endDate?: string;
  caloriesTarget?: number;
  proteinTarget?: number;
  carbsTarget?: number;
  fatTarget?: number;
  fiberTarget?: number;
  macroType?: 'grams' | 'percentage';
  active?: boolean;
  notes?: string | null;
}

export interface GoalListQuery {
  userId: string;
  activeOnly?: boolean;
}
