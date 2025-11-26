export interface Meal {
  id: string;
  userId: string;
  mealName: string;
  mealDate: string;
  mealTime: string;
  description?: string;
  location?: string;
  tags?: string[];
  createdAt: string;
}

export interface CreateMealDto {
  userId: string;
  mealName: string;
  mealDate: string;
  mealTime: string;
  description?: string;
  location?: string;
  tags?: string[];
}

export interface UpdateMealDto {
  mealName?: string;
  mealDate?: string;
  mealTime?: string;
  description?: string;
  location?: string;
  tags?: string[];
}

export interface MealListParams {
  userId: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
