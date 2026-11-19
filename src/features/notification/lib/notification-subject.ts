import { formatCurrency } from '@/base/utils';
import type { NotificationItem } from '../types';

export const formatNotificationSubject = (item: NotificationItem, locale: string,
  roleLabel: (role: 'OWNER' | 'VICE' | 'MEMBER') => string) => {
  if (item.type === 'MEMBER_ROLE_CHANGED') {
    return item.subject === 'OWNER' || item.subject === 'VICE' || item.subject === 'MEMBER' ? roleLabel(item.subject) : '';
  }
  if (item.type.startsWith('SETTLEMENT_')) {
    const match = /^(-?\d+(?:\.\d+)?) ([A-Z]{3})$/.exec(item.subject);
    if (match) return formatCurrency(Number(match[1]), match[2], locale);
  }
  return item.subject;
};
