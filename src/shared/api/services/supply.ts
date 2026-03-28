import type {
  RecalculateResponse,
  RecalculateStatusResponse,
  StockVisibilityRequest,
  SupplyDemandResponse,
} from '@/shared/api/contracts/request-response';
import { http } from '@/shared/api/http/client';

export const supplyService = {
  demand() {
    return http<SupplyDemandResponse>('/supply/demand');
  },
  recalculate() {
    return http<RecalculateResponse>('/supply/recalculate', { method: 'POST' });
  },
  recalculateStatus(runId: string) {
    return http<RecalculateStatusResponse>(`/supply/recalculate/status/${runId}`);
  },
  stockByProduct(id: number) {
    return http<Array<Record<string, unknown>>>(`/stock/product/${id}`);
  },
  updateVisibility(payload: StockVisibilityRequest) {
    return http<{ ok: true }>('/stock/visible', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
