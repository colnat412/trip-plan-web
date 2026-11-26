import type { Settlement } from '../types';

export function hasPendingPayment(
  settlements: Settlement[],
  payerId: string,
  payeeId: string,
  currency: string,
): boolean {
  return settlements.some((item) =>
    item.status === 'PENDING' && item.payerId === payerId && item.payeeId === payeeId &&
    item.currency.toUpperCase() === currency.trim().toUpperCase(),
  );
}
