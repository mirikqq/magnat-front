import type { WarehousesResponse, WarehousesUpdateRequest } from '@/shared/api/contracts/request-response';
import { http } from '@/shared/api/http/client';

export const warehousesService = {
  list(mp = 'ozon') {
    return http<WarehousesResponse>(`/warehouses/${mp}`);
  },
  update(mp = 'ozon', payload: WarehousesUpdateRequest) {
    return http<{ ok: true }>(`/warehouses/${mp}`, { method: 'PATCH', body: JSON.stringify(payload) });
  },
};
