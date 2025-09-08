import { Prisma } from '@prisma/client';

export function isPrismaDecimal(value: any): value is Prisma.Decimal {
  return typeof value === 'object' && value !== null && 'toNumber' in value;
}

export function decimalToNumber(value: Prisma.Decimal | number): number {
  if (isPrismaDecimal(value)) {
    return value.toNumber();
  }
  return Number(value);
}