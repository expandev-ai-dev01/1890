export interface Food {
  id: string;
  name: string;
  mainCategory: string;
  subcategory?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  vitaminA?: number;
  vitaminC?: number;
  calcium?: number;
  iron?: number;
  sodium?: number;
  additionalMicronutrients?: Record<string, number>;
  dataSource: string;
  standardServing: number;
  standardServingUnit: string;
  conversionFactors: Record<string, number>;
  isPublic: boolean;
  tags?: string[];
}

export interface FoodSearchParams {
  query?: string;
  category?: string;
  tags?: string;
  limit?: number;
}
