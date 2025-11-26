import { useQuery } from '@tanstack/react-query';
import { foodService } from '../../services/foodService';
import type { FoodSearchParams } from '../../types/food';

export const useFoodSearch = (params: FoodSearchParams) => {
  const queryKey = ['foods', params];

  const { data, ...queryInfo } = useQuery({
    queryKey,
    queryFn: () => foodService.search(params),
    enabled: !!params.query || !!params.category,
  });

  return { data: data ?? [], ...queryInfo };
};
