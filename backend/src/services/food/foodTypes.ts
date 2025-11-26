/**
 * @summary
 * Food type definitions.
 *
 * @module services/food/foodTypes
 */

export interface Food {
  id: string;
  name: string;
  mainCategory: string;
  subcategory: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  vitamins: {
    vitaminA?: number;
    vitaminC?: number;
  };
  minerals: {
    calcium?: number;
    iron?: number;
    sodium?: number;
  };
  dataSource: string;
  standardPortion: number;
  standardPortionUnit: string;
  conversionFactors: { [key: string]: number };
  creatorUserId?: string;
  isPublic: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FoodSearchQuery {
  query?: string;
  category?: string;
  tags?: string;
  limit?: number;
}
