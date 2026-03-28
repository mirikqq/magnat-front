export function ceilByMultiplicity(value: number, minCount: number): number {
  if (minCount <= 0) return 0;
  return Math.ceil(value / minCount) * minCount;
}

export function calcOrderAmount(totalNeed: number, minCount: number, price: number): number {
  return ceilByMultiplicity(totalNeed, minCount) * price;
}

export function calcLogistics(qty: number, volume: number) {
  const liters = qty * volume;
  const boxes = liters / 96;
  const pallets = boxes / 16;
  return { liters, boxes, pallets };
}
