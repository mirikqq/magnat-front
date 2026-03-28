import { useAppQuery } from '@/shared/api/colada';
import { queryKeys } from '@/shared/api/queryKeys';
import { supplyService } from '@/shared/api/services/supply';

export function useNeededDemandQuery() {
  return useAppQuery({ key: queryKeys.needed, query: () => supplyService.demand() });
}
