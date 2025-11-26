import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mealService } from '../../services/mealService';
import type { MealListParams, CreateMealDto, UpdateMealDto } from '../../types/meal';

export const useMealList = (params: MealListParams) => {
  const queryClient = useQueryClient();
  const queryKey = ['meals', params];

  const { data, ...queryInfo } = useQuery({
    queryKey,
    queryFn: () => mealService.list(params),
  });

  const { mutateAsync: create } = useMutation({
    mutationFn: (data: CreateMealDto) => mealService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const { mutateAsync: update } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMealDto }) => mealService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const { mutateAsync: remove } = useMutation({
    mutationFn: (id: string) => mealService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return { data: data ?? [], create, update, remove, ...queryInfo };
};
