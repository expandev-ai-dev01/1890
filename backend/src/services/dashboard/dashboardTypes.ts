/**
 * @summary
 * Dashboard type definitions.
 *
 * @module services/dashboard/dashboardTypes
 */

export interface DashboardQuery {
  userId: string;
  date?: string;
}

export interface DashboardData {
  date: string;
  dailySummary: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  macroDistribution: {
    protein: number;
    carbs: number;
    fat: number;
  };
  meals: Array<{
    mealId: string;
    mealName: string;
    mealTime: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>;
  goalProgress: {
    calories: number;
    protein: number | null;
    carbs: number | null;
    fat: number | null;
  } | null;
  remainingCalories: number | null;
  remainingMacros: {
    protein: number | null;
    carbs: number | null;
    fat: number | null;
  } | null;
  lastUpdated: string;
}
