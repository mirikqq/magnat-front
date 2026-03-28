import { env } from '@/shared/config/env';

export async function enableMswIfNeeded() {
  if (!env.useMsw) {
    return;
  }

  const { worker } = await import('@/mocks/browser');
  await worker.start({
    onUnhandledRequest: 'bypass',
  });
}
