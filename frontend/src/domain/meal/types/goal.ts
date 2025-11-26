export interface Goal {
  id: string;
  userId: string;
  goalName: string;
  startDate: string;
  endDate?: string;
  caloriesTarget: number;
  proteinTarget?: number;
  carbsTarget?: number;
  fatTarget?: number;
  fiberTarget?: number;
  vitaminATarget?: number;
  vitaminCTarget?: number;
  calciumTarget?: number;
  ironTarget?: number;
  sodiumTarget?: number;
  additionalMicronutrientsTargets?: Record<string, number>;
  macroType: 'grams' | 'percentage';
  active: boolean;
  notes?: string;
}

export interface CreateGoalDto {
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
  notes?: string;
}

export interface UpdateGoalDto {
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
  notes?: string;
}

export interface GoalListParams {
  userId: string;
  activeOnly?: boolean;
}
