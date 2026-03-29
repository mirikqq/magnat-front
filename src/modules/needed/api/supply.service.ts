import type {
  RecalculateResponse,
  RecalculateStatusResponse,
  StockVisibilityRequest,
  SupplyDemandResponse,
} from '@/shared/api/contracts/request-response'
import { http } from '@/lib/http'
import { toNumber } from '@/lib/utils'

export const supplyService = {
  async demand() {
    const response = await http<SupplyDemandResponse | { items: SupplyDemandResponse }>('/supply/demand')
    const items = Array.isArray(response) ? response : response.items
    return items.map((item) => ({
      ...item,
      price: toNumber(item.price),
      min_count: item.min_count ?? 1,
      total_need: item.total_need ?? item.needmin ?? item.need ?? 0,
      in_our_stock: item.in_our_stock ?? 0,
      stock_reserve: item.stock_reserve ?? 0,
      warehouses: item.warehouses ?? [],
    }))
  },
  async recalculate() {
    const response = await http<RecalculateResponse>('/supply/recalculate', { method: 'POST' })
    return {
      ...response,
      runId: response.runId ?? response.run_id,
    }
  },
  async recalculateStatus(runId: string) {
    const response = await http<RecalculateStatusResponse>(`/supply/recalculate/status/${runId}`)
    return {
      ...response,
      runId: response.runId ?? response.run_id,
    }
  },
  stockByProduct(id: number) {
    return http<Array<Record<string, unknown>>>(`/stock/product/${id}`)
  },
  updateVisibility(payload: StockVisibilityRequest) {
    return http<void>('/stock/visible', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}

