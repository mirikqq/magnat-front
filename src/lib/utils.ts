export function toNumber(value: number | string | null | undefined): number {
  if (typeof value === 'number') return value
  if (!value) return 0
  const parsed = Number(String(value).replace(',', '.'))
  return Number.isNaN(parsed) ? 0 : parsed
}
