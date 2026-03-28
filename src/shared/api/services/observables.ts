import type { ObservableDto } from '@/shared/api/contracts/domain';
import type { FullfillStockResponse, InWayResponse, InWayUpdateRequest, ObservableUpsertRequest, StockUpdateRequest } from '@/shared/api/contracts/request-response';
import { http } from '@/shared/api/http/client';

export const observablesService = {
  inway() {
    return http<InWayResponse>('/observables/inway');
  },
  updateInway(payload: InWayUpdateRequest) {
    return http<{ ok: true }>('/observables/inway', { method: 'PATCH', body: JSON.stringify(payload) });
  },
  stock() {
    return http<FullfillStockResponse>('/observables/stock');
  },
  updateStock(payload: StockUpdateRequest) {
    return http<{ ok: true }>('/observables/stock', { method: 'PATCH', body: JSON.stringify(payload) });
  },
  list(search = '') {
    return http<ObservableDto[]>(`/observables?search=${encodeURIComponent(search)}&page=1`);
  },
  get(id: string | number) {
    return http<ObservableDto>(`/observables/${id}`);
  },
  create(payload: ObservableUpsertRequest) {
    return http<ObservableDto>('/observables', { method: 'POST', body: JSON.stringify(payload) });
  },
  update(id: string | number, payload: ObservableUpsertRequest) {
    return http<ObservableDto>(`/observables/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
  },
  remove(id: string | number) {
    return http<{ ok: true }>(`/observables/${id}`, { method: 'DELETE' });
  },
  witems() {
    return http<Array<Record<string, unknown>>>('/observables/witems');
  },
};
