/**
 * @summary
 * Dietary goal business logic implementation.
 * Manages user dietary goals with automatic deactivation.
 *
 * @module services/goal/goalLogic
 */

import { v4 as uuidv4 } from 'uuid';
import { Goal, GoalCreateInput, GoalUpdateInput, GoalListQuery } from './goalTypes';

const goals: Goal[] = [];

/**
 * @summary
 * Creates a new dietary goal
 */
export async function goalCreate(input: GoalCreateInput): Promise<Goal> {
  /**
   * @rule {BR-027}
   * When activating a new goal, deactivate other active goals for the user
   */
  if (input.active !== false) {
    goals.forEach((g) => {
      if (g.userId === input.userId && g.active) {
        g.active = false;
      }
    });
  }

  const goal: Goal = {
    id: uuidv4(),
    userId: input.userId,
    goalName: input.goalName,
    startDate: input.startDate,
    endDate: input.endDate || null,
    caloriesTarget: input.caloriesTarget,
    proteinTarget: input.proteinTarget || null,
    carbsTarget: input.carbsTarget || null,
    fatTarget: input.fatTarget || null,
    fiberTarget: input.fiberTarget || null,
    macroType: input.macroType,
    active: input.active !== false,
    notes: input.notes || null,
  };

  goals.push(goal);
  return goal;
}

/**
 * @summary
 * Lists user's dietary goals
 */
export async function goalList(query: GoalListQuery): Promise<Goal[]> {
  let filtered = goals.filter((g) => g.userId === query.userId);

  if (query.activeOnly) {
    filtered = filtered.filter((g) => g.active);
  }

  return filtered;
}

/**
 * @summary
 * Gets a specific goal by ID
 */
export async function goalGet(id: string): Promise<Goal | null> {
  return goals.find((g) => g.id === id) || null;
}

/**
 * @summary
 * Updates an existing goal
 */
export async function goalUpdate(id: string, input: GoalUpdateInput): Promise<Goal | null> {
  const index = goals.findIndex((g) => g.id === id);

  if (index === -1) {
    return null;
  }

  /**
   * @rule {BR-027}
   * When activating a goal, deactivate other active goals for the user
   */
  if (input.active === true) {
    const userId = goals[index].userId;
    goals.forEach((g) => {
      if (g.userId === userId && g.id !== id && g.active) {
        g.active = false;
      }
    });
  }

  goals[index] = {
    ...goals[index],
    ...input,
  };

  return goals[index];
}
