export function normalizeNumericInput(value: string): number {
  const normalized = value.replace(',', '.').replace(/[^0-9.]/g, '');
  if (!normalized) return 0;
  return Number(normalized);
}
