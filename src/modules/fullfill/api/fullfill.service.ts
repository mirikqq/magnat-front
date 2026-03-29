import type { FullfillDeliveryRequest, FullfillDetailResponse, FullfillResponse, FullfillUpdateRequest } from '@/shared/api/contracts/request-response'
import { http } from '@/lib/http'

export const fullfillService = {
  async list() {
    const response = await http<FullfillResponse | { items: FullfillResponse }>('/fullfill')
    return Array.isArray(response) ? response : response.items
  },
  create(payload: Record<string, unknown>) {
    return http<FullfillDetailResponse>('/fullfill', { method: 'POST', body: JSON.stringify(payload) })
  },
  get(id: string | number) {
    return http<FullfillDetailResponse>(`/fullfill/${id}`)
  },
  update(id: string | number, payload: FullfillUpdateRequest) {
    return http<{ ok: true }>(`/fullfill/${id}`, { method: 'PATCH', body: JSON.stringify(payload) })
  },
  remove(id: string | number) {
    return http<{ ok: true }>(`/fullfill/${id}`, { method: 'DELETE' })
  },
  approve(id: string | number) {
    return http<{ ok: true }>(`/fullfill/${id}/approve`, { method: 'POST' })
  },
  delivery(id: string | number) {
    return http<Array<{ warehouse_name: string; in_delivery: boolean }> | { warehouses?: Record<string, boolean> }>(`/fullfill/${id}/delivery`)
  },
  updateDelivery(id: string | number, payload: FullfillDeliveryRequest) {
    const body = {
      warehouses: payload.warehouses.reduce<Record<string, boolean>>((acc, item) => {
        acc[item.warehouse_name] = item.in_delivery
        return acc
      }, {}),
    }
    return http<{ ok: true }>(`/fullfill/${id}/delivery`, { method: 'POST', body: JSON.stringify(body) })
  },
  newByMp(mp: string) {
    return http<Array<Record<string, unknown>>>(`/fullfill/new/${mp}`)
  },
}
