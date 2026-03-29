import type {
  FullfillStockResponse,
  InWayResponse,
} from '@/shared/api/contracts/request-response'
import type { ObservableInWayUpdate, ObservableStockAdd } from '@/openapi-gen'
import { http } from '@/lib/http'
import { toNumber } from '@/lib/utils'

function normalizeObservable<T extends { price?: number | string | null }>(item: T): T & { price: number } {
  return {
    ...item,
    price: toNumber(item.price),
  }
}

export const observablesService = {
  async inway() {
    const response = await http<InWayResponse>('/observables/inway')
    return response.map(normalizeObservable)
  },
  updateInway(payload: ObservableInWayUpdate[]) {
    return http<void>('/observables/inway', { method: 'PATCH', body: JSON.stringify(payload) })
  },
  async stock() {
    const response = await http<FullfillStockResponse>('/observables/stock')
    return response.map(normalizeObservable)
  },
  updateStock(payload: ObservableStockAdd[]) {
    return http<void>('/observables/stock', { method: 'PATCH', body: JSON.stringify(payload) })
  },
}

