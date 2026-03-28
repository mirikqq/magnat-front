import type { FullfillDeliveryRequest, FullfillDetailResponse, FullfillResponse, FullfillUpdateRequest } from '@/shared/api/contracts/request-response';
import { http } from '@/shared/api/http/client';

export const fullfillService = {
  list() {
    return http<FullfillResponse>('/fullfill');
  },
  create(payload: Record<string, unknown>) {
    return http<FullfillDetailResponse>('/fullfill', { method: 'POST', body: JSON.stringify(payload) });
  },
  get(id: string | number) {
    return http<FullfillDetailResponse>(`/fullfill/${id}`);
  },
  update(id: string | number, payload: FullfillUpdateRequest) {
    return http<{ ok: true }>(`/fullfill/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
  },
  remove(id: string | number) {
    return http<{ ok: true }>(`/fullfill/${id}`, { method: 'DELETE' });
  },
  approve(id: string | number) {
    return http<{ ok: true }>(`/fullfill/${id}/approve`, { method: 'POST' });
  },
  delivery(id: string | number) {
    return http<Array<{ warehouse_name: string; in_delivery: boolean }>>(`/fullfill/${id}/delivery`);
  },
  updateDelivery(id: string | number, payload: FullfillDeliveryRequest) {
    return http<{ ok: true }>(`/fullfill/${id}/delivery`, { method: 'POST', body: JSON.stringify(payload) });
  },
  newByMp(mp: string) {
    return http<Array<Record<string, unknown>>>(`/fullfill/new/${mp}`);
  },
};
