export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  datalensUrl: import.meta.env.VITE_DATALENS_URL ?? '',
  useMsw: String(import.meta.env.VITE_USE_MSW ?? 'false') === 'true',
};
