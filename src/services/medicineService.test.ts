import { describe, expect, it } from 'vitest';
import { medicineService } from './medicineService';

describe('medicineService', () => {
  it('derives low stock status before persistence', () => {
    expect(
      medicineService._determineMedicineStatus({
        expiryDate: '2099-01-01',
        stock: 4,
        minStock: 10,
      }),
    ).toBe('Low Stock');
  });
});
