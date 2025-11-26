export interface DashboardData {
  date: string;
  dailySummary: {
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    totalFiber: number;
  };
  goalProgress?: {
    caloriesProgress: number;
    proteinProgress?: number;
    carbsProgress?: number;
    fatProgress?: number;
    fiberProgress?: number;
  };
  meals: Array<{
    id: string;
    mealName: string;
    mealTime: string;
    calories: number;
  }>;
  macroDistribution: {
    proteinPercentage: number;
    carbsPercentage: number;
    fatPercentage: number;
  };
  remainingCalories?: number;
  remainingMacros?: {
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  alerts?: Array<{
    type: 'warning' | 'info' | 'success';
    message: string;
  }>;
}

export interface DashboardParams {
  userId: string;
  date?: string;
}
