import type {
  CreateOrderRequest,
  OrderResponse,
  OrdersResponse,
  UpdateOrderRequest,
} from '@/shared/api/contracts/request-response'
import { http } from '@/lib/http'

export const ordersService = {
  async list() {
    const response = await http<OrdersResponse | { items: OrdersResponse }>('/orders')
    return Array.isArray(response) ? response : response.items
  },
  create(payload: CreateOrderRequest) {
    return http<OrderResponse>('/orders', { method: 'POST', body: JSON.stringify(payload) })
  },
  get(id: string | number) {
    return http<OrderResponse>(`/orders/${id}`)
  },
  update(id: string | number, payload: UpdateOrderRequest) {
    return http<OrderResponse>(`/orders/${id}`, { method: 'PATCH', body: JSON.stringify(payload) })
  },
  remove(id: string | number) {
    return http<{ ok: true }>(`/orders/${id}`, { method: 'DELETE' })
  },
  approve(id: string | number) {
    return http<{ ok: true }>(`/orders/${id}/approve`, { method: 'POST' })
  },
}

