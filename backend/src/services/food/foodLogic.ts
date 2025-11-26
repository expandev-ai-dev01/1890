/**
 * @summary
 * Food database business logic.
 * Manages food items with nutritional information.
 *
 * @module services/food/foodLogic
 */

import { v4 as uuidv4 } from 'uuid';
import { Food, FoodSearchQuery } from './foodTypes';

const foods: Food[] = [
  {
    id: uuidv4(),
    name: 'Arroz Branco Cozido',
    mainCategory: 'Grãos',
    subcategory: 'Cereais',
    calories: 130,
    protein: 2.7,
    carbs: 28.2,
    fat: 0.3,
    fiber: 0.4,
    vitamins: { vitaminA: 0, vitaminC: 0 },
    minerals: { calcium: 10, iron: 0.2, sodium: 1 },
    dataSource: 'TACO',
    standardPortion: 100,
    standardPortionUnit: 'g',
    conversionFactors: { g: 1, cup: 158 },
    isPublic: true,
    tags: ['cereal', 'carboidrato'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Frango Grelhado',
    mainCategory: 'Proteínas',
    subcategory: 'Aves',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    vitamins: { vitaminA: 21, vitaminC: 0 },
    minerals: { calcium: 15, iron: 1.3, sodium: 82 },
    dataSource: 'USDA',
    standardPortion: 100,
    standardPortionUnit: 'g',
    conversionFactors: { g: 1, unit: 120 },
    isPublic: true,
    tags: ['proteína', 'carne'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Banana',
    mainCategory: 'Frutas',
    subcategory: 'Frutas Tropicais',
    calories: 89,
    protein: 1.1,
    carbs: 22.8,
    fat: 0.3,
    fiber: 2.6,
    vitamins: { vitaminA: 64, vitaminC: 8.7 },
    minerals: { calcium: 5, iron: 0.3, sodium: 1 },
    dataSource: 'TACO',
    standardPortion: 100,
    standardPortionUnit: 'g',
    conversionFactors: { g: 1, unit: 118 },
    isPublic: true,
    tags: ['fruta', 'potássio'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * @summary
 * Searches for foods in the database
 */
export async function foodSearch(query: FoodSearchQuery): Promise<Food[]> {
  let filtered = foods.filter((f) => f.isPublic);

  if (query.query) {
    const searchTerm = query.query.toLowerCase();
    filtered = filtered.filter((f) => f.name.toLowerCase().includes(searchTerm));
  }

  if (query.category) {
    filtered = filtered.filter((f) => f.mainCategory === query.category);
  }

  if (query.tags) {
    const searchTags = query.tags.split(',').map((t) => t.trim().toLowerCase());
    filtered = filtered.filter((f) => f.tags.some((tag) => searchTags.includes(tag.toLowerCase())));
  }

  const limit = query.limit || 50;
  return filtered.slice(0, limit);
}

/**
 * @summary
 * Gets detailed information about a specific food
 */
export async function foodGet(id: string): Promise<Food | null> {
  return foods.find((f) => f.id === id) || null;
}
