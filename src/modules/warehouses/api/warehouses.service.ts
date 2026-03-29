import type { WarehousesResponse, WarehousesUpdateRequest } from '@/shared/api/contracts/request-response'
import { http } from '@/lib/http'

export const warehousesService = {
  async list(mp = 'ozon') {
    const response = await http<WarehousesResponse | { items: WarehousesResponse }>(`/warehouses/${mp}`)
    return Array.isArray(response) ? response : response.items
  },
  update(mp = 'ozon', payload: WarehousesUpdateRequest) {
    const body = 'items' in payload ? payload : { items: payload.warehouses }
    return http<{ ok: true }>(`/warehouses/${mp}`, { method: 'PATCH', body: JSON.stringify(body) })
  },
}

