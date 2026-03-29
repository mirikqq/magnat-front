import { describe, expect, it } from 'vitest';
import { calcLogistics, calcOrderAmount, ceilByMultiplicity } from '@/lib/math';

describe('math helpers', () => {
  it('ceil by multiplicity works', () => {
    expect(ceilByMultiplicity(43, 5)).toBe(45);
  });

  it('order amount works', () => {
    expect(calcOrderAmount(43, 5, 250)).toBe(11250);
  });

  it('logistics works', () => {
    const value = calcLogistics(10, 1.2);
    expect(value.liters).toBeCloseTo(12);
  });
});

