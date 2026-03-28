import type { SupplierUpsertRequest, SuppliersResponse } from '@/shared/api/contracts/request-response';
import { http } from '@/shared/api/http/client';

export const suppliersService = {
  list(search = '') {
    return http<SuppliersResponse>(`/suppliers?search=${encodeURIComponent(search)}&page=1`);
  },
  get(id: string | number) {
    return http<{ id: number; name: string }>(`/suppliers/${id}`);
  },
  create(payload: SupplierUpsertRequest) {
    return http<{ id: number; name: string }>('/suppliers', { method: 'POST', body: JSON.stringify(payload) });
  },
  update(id: string | number, payload: SupplierUpsertRequest) {
    return http<{ id: number; name: string }>(`/suppliers/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
  },
  remove(id: string | number) {
    return http<{ ok: true }>(`/suppliers/${id}`, { method: 'DELETE' });
  },
};
