'use client';

import { ButtonBase } from '@mui/material';

/** A single accessible switch; the landscape is decorative SVG, not separate controls. */
export default function AppThemeToggle({ dark, label, disabled = false, onChange }: {
  dark: boolean; label: string; disabled?: boolean; onChange: (dark: boolean) => void;
}) {
  return <ButtonBase role="switch" aria-checked={dark} aria-label={label} disabled={disabled}
    onClick={() => onChange(!dark)}
    sx={{ width: 88, height: 44, flexShrink: 0, borderRadius: '999px', overflow: 'hidden',
      '--theme-toggle-sky': theme => theme.palette.primary.light,
      '--theme-toggle-night': '#091728',
      '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 3 },
      '& .theme-thumb, & .theme-day, & .theme-night': { transition: 'transform 260ms ease, opacity 260ms ease' },
      '@media (prefers-reduced-motion: reduce)': { '& *': { transition: 'none !important' } },
    }}>
    <svg width="84" height="38" viewBox="0 0 104 48" aria-hidden="true" focusable="false">
      <rect width="104" height="48" rx="24" fill={dark ? 'var(--theme-toggle-night)' : 'var(--theme-toggle-sky)'} />
      <g className="theme-day" opacity={dark ? 0 : 1}>
        <circle cx="24" cy="24" r="43" fill="#fff" opacity=".12" />
        <circle cx="24" cy="24" r="33" fill="#fff" opacity=".12" />
        <path d="M52 43c-2-7 4-12 10-10 1-11 17-14 21-3 7-2 14 4 13 11h8v7H45v-5z" fill="#d8eeff" />
        <path d="M74 13c0-6 8-8 11-3 6-2 11 3 10 7h9v6H68c-5-5 0-10 6-10z" fill="#e6f5ff" opacity=".85" />
      </g>
      <g className="theme-night" opacity={dark ? 1 : 0}>
        <circle cx="80" cy="24" r="44" fill="#fff" opacity=".08" />
        <circle cx="80" cy="24" r="34" fill="#fff" opacity=".08" />
        <path d="m18 9 1.2 3.8L23 14l-3.8 1.2L18 19l-1.2-3.8L13 14l3.8-1.2zM38 29l1 3 3 1-3 1-1 3-1-3-3-1 3-1zM14 35l.8 2.2L17 38l-2.2.8L14 41l-.8-2.2L11 38l2.2-.8z" fill="#fff" />
        <circle cx="31" cy="17" r=".8" fill="#fff" /><circle cx="49" cy="12" r=".9" fill="#fff" />
      </g>
      <g className="theme-thumb" style={{ transform: `translateX(${dark ? 56 : 0}px)` }}>
        <circle cx="24" cy="24" r="20" fill={dark ? '#d9e0e5' : '#ffcf54'} stroke={dark ? '#f4f7f9' : '#ffe49b'} />
        {dark && <g fill="#aebbc4" opacity=".7"><circle cx="18" cy="19" r="4" /><circle cx="30" cy="28" r="3" /><circle cx="21" cy="34" r="2" /></g>}
      </g>
    </svg>
  </ButtonBase>;
}
