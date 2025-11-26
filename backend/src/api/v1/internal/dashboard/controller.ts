/**
 * @summary
 * Dashboard controller for nutritional overview.
 * Provides daily summary and progress tracking.
 *
 * @api {get} /api/v1/internal/dashboard Get Dashboard
 * @apiName GetDashboard
 * @apiGroup Dashboard
 * @apiVersion 1.0.0
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '@/utils/response';
import { dashboardGet } from '@/services/dashboard';

const querySchema = z.object({
  userId: z.string().uuid(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

/**
 * @summary
 * Gets dashboard data for a specific date
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = querySchema.parse(req.query);

    const dashboard = await dashboardGet(validated);
    res.json(successResponse(dashboard));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
      return;
    }
    next(error);
  }
}
