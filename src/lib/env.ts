import { API_BASE_URL } from '@/shared/config/api'

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, '')
}

export const env = {
  apiBaseUrl: normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL ?? API_BASE_URL),
  datalensUrl: import.meta.env.VITE_DATALENS_URL ?? '',
  useMsw: String(import.meta.env.VITE_USE_MSW ?? 'false') === 'true',
};
