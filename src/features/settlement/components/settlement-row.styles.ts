/** Shared geometry for member balances, suggested payments and mobile history. */
export const settlementRowStyles = {
  row: {
    display: 'flex', alignItems: 'center', gap: 1, minWidth: 0,
    minHeight: 84, py: 1.25, px: 0.5, boxSizing: 'border-box',
  },
  avatar: { width: 32, height: 32, fontSize: '12px', flexShrink: 0 },
  identity: { display: 'flex', flexDirection: 'column', gap: 0.25, flex: 1, minWidth: 0 },
  heading: { display: 'flex', alignItems: 'baseline', gap: 1, minWidth: 0 },
  primary: { fontSize: '14px', fontWeight: 600, lineHeight: 1.5, minWidth: 0 },
  secondary: { fontSize: '12px', fontWeight: 400, lineHeight: 1.5, color: 'text.secondary', minWidth: 0 },
  amount: {
    fontSize: '14px', fontWeight: 600, lineHeight: 1.5,
    fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', flexShrink: 0,
  },
} as const;
