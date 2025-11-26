import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalService } from '../../services/goalService';
import type { GoalListParams, CreateGoalDto, UpdateGoalDto } from '../../types/goal';

export const useGoalList = (params: GoalListParams) => {
  const queryClient = useQueryClient();
  const queryKey = ['goals', params];

  const { data, ...queryInfo } = useQuery({
    queryKey,
    queryFn: () => goalService.list(params),
  });

  const { mutateAsync: create } = useMutation({
    mutationFn: (data: CreateGoalDto) => goalService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const { mutateAsync: update } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGoalDto }) => goalService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return { data: data ?? [], create, update, ...queryInfo };
};
