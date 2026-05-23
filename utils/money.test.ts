import { describe, expect, it } from 'vitest';
import { formatINR, formatINR2, formatINRCompact } from './money';

describe('money formatting utilities', () => {
  it('formats INR with Indian digit grouping and no paise by default', () => {
    expect(formatINR(123456)).toBe('₹1,23,456');
  });

  it('formats INR with two paise digits through formatINR2', () => {
    expect(formatINR2(1234.5)).toBe('₹1,234.50');
  });

  it('compacts thousand values with K suffix', () => {
    expect(formatINRCompact(12500)).toBe('₹12.5 K');
  });

  it('compacts lakh and crore values with Indian suffixes', () => {
    expect(formatINRCompact(150000)).toBe('₹1.5 L');
    expect(formatINRCompact(25000000)).toBe('₹2.5 Cr');
  });
});
