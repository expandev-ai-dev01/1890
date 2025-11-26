/**
 * @summary
 * Dashboard business logic implementation.
 * Provides daily nutritional summary and progress tracking.
 *
 * @module services/dashboard/dashboardLogic
 */

import { DashboardData, DashboardQuery } from './dashboardTypes';
import { mealList } from '@/services/meal';
import { mealFoodList } from '@/services/mealFood';
import { goalList } from '@/services/goal';

/**
 * @summary
 * Gets dashboard data for a specific date
 */
export async function dashboardGet(query: DashboardQuery): Promise<DashboardData> {
  const date = query.date || new Date().toISOString().split('T')[0];

  const meals = await mealList({
    userId: query.userId,
    startDate: date,
    endDate: date,
  });

  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalFiber = 0;

  const mealSummaries = [];

  for (const meal of meals) {
    const foods = await mealFoodList(meal.id);

    let mealCalories = 0;
    let mealProtein = 0;
    let mealCarbs = 0;
    let mealFat = 0;

    for (const food of foods) {
      mealCalories += food.calculatedCalories;
      mealProtein += food.calculatedProtein;
      mealCarbs += food.calculatedCarbs;
      mealFat += food.calculatedFat;
      totalFiber += food.calculatedFiber;
    }

    totalCalories += mealCalories;
    totalProtein += mealProtein;
    totalCarbs += mealCarbs;
    totalFat += mealFat;

    mealSummaries.push({
      mealId: meal.id,
      mealName: meal.mealName,
      mealTime: meal.mealTime,
      calories: mealCalories,
      protein: mealProtein,
      carbs: mealCarbs,
      fat: mealFat,
    });
  }

  const totalMacroCalories = totalProtein * 4 + totalCarbs * 4 + totalFat * 9;
  const macroDistribution = {
    protein: totalMacroCalories > 0 ? ((totalProtein * 4) / totalMacroCalories) * 100 : 0,
    carbs: totalMacroCalories > 0 ? ((totalCarbs * 4) / totalMacroCalories) * 100 : 0,
    fat: totalMacroCalories > 0 ? ((totalFat * 9) / totalMacroCalories) * 100 : 0,
  };

  const activeGoals = await goalList({ userId: query.userId, activeOnly: true });
  const activeGoal = activeGoals[0] || null;

  let goalProgress = null;
  let remainingCalories = null;
  let remainingMacros = null;

  if (activeGoal) {
    const caloriesPercent = (totalCalories / activeGoal.caloriesTarget) * 100;

    goalProgress = {
      calories: caloriesPercent,
      protein: activeGoal.proteinTarget ? (totalProtein / activeGoal.proteinTarget) * 100 : null,
      carbs: activeGoal.carbsTarget ? (totalCarbs / activeGoal.carbsTarget) * 100 : null,
      fat: activeGoal.fatTarget ? (totalFat / activeGoal.fatTarget) * 100 : null,
    };

    remainingCalories = activeGoal.caloriesTarget - totalCalories;

    remainingMacros = {
      protein: activeGoal.proteinTarget ? activeGoal.proteinTarget - totalProtein : null,
      carbs: activeGoal.carbsTarget ? activeGoal.carbsTarget - totalCarbs : null,
      fat: activeGoal.fatTarget ? activeGoal.fatTarget - totalFat : null,
    };
  }

  return {
    date,
    dailySummary: {
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
      fiber: totalFiber,
    },
    macroDistribution,
    meals: mealSummaries,
    goalProgress,
    remainingCalories,
    remainingMacros,
    lastUpdated: new Date().toISOString(),
  };
}
