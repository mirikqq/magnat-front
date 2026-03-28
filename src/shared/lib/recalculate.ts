import { supplyService } from '@/shared/api/services/supply';

export async function runRecalculateAndWait() {
  const run = await supplyService.recalculate();

  for (let i = 0; i < 30; i += 1) {
    const status = await supplyService.recalculateStatus(run.runId);
    if (status.status === 'success') return status;
    if (status.status === 'error') throw new Error(status.message ?? 'Ошибка пересчета');
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error('Превышено время ожидания пересчета');
}
