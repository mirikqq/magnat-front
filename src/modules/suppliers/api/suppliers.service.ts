import type { SupplierUpsertRequest, SuppliersResponse } from '@/shared/api/contracts/request-response'
import { http } from '@/lib/http'

export const suppliersService = {
  async list(search = '') {
    const response = await http<SuppliersResponse>(`/suppliers?q=${encodeURIComponent(search)}&page=1`)
    return Array.isArray(response) ? response : response.items
  },
  async get(id: string | number) {
    const suppliers = await this.list('')
    const found = suppliers.find((item) => item.id === Number(id))
    if (!found) {
      throw new Error('Поставщик не найден')
    }
    return found
  },
  create(payload: SupplierUpsertRequest) {
    return http<{ id: number; name: string }>('/suppliers', { method: 'POST', body: JSON.stringify(payload) })
  },
  update(id: string | number, payload: SupplierUpsertRequest) {
    return http<{ id: number; name: string }>(`/suppliers/${id}`, { method: 'PATCH', body: JSON.stringify(payload) })
  },
  remove(id: string | number) {
    return http<void>(`/suppliers/${id}`, { method: 'DELETE' })
  },
}

