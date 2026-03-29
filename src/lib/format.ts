import dayjs from 'dayjs';

const numberFmt = new Intl.NumberFormat('ru-RU');
const currencyFmt = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatNumber(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '-';
  return numberFmt.format(value);
}

export function formatMoney(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '-';
  return currencyFmt.format(value);
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '-';
  return dayjs(value).format('DD.MM.YYYY HH:mm');
}
