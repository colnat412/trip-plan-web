'use client';

import { brandSurface, selectedSurface } from '@/base/theme/surfaces';

import { createContext, useContext } from 'react';
import { PickerDay, type PickerDayProps } from '@mui/x-date-pickers/PickerDay';

export const AppCalendarRangeContext = createContext({ start: '', end: '' });

const AppCalendarDay = (props: PickerDayProps) => {
  const { start, end } = useContext(AppCalendarRangeContext);
  const date = props.day.format('YYYY-MM-DD');
  const endpoint = date === start || date === end;
  const withinRange = !!start && !!end && date >= start && date <= end;
  const connected = withinRange && start < end;
  const roundStart = date === start || props.day.isSame(props.day.startOf('week'), 'day');
  const roundEnd = date === end || props.day.isSame(props.day.endOf('week'), 'day');

  return (
    <PickerDay
      {...props}
      selected={endpoint}
      disableHighlightToday={props.disableHighlightToday || endpoint || withinRange}
      aria-selected={endpoint || withinRange}
      sx={(theme) => ({
        '--PickerDay-horizontalMargin': '0px',
        flex: 1,
        maxWidth: 44,
        height: 40,
        borderRadius: 'var(--app-radius-control)',
        ...(connected && {
          borderRadius: 0,
          borderStartStartRadius: roundStart ? 'var(--app-radius-control)' : 0,
          borderEndStartRadius: roundStart ? 'var(--app-radius-control)' : 0,
          borderStartEndRadius: roundEnd ? 'var(--app-radius-control)' : 0,
          borderEndEndRadius: roundEnd ? 'var(--app-radius-control)' : 0,
        }),
        ...(withinRange && !endpoint && {
          ...selectedSurface(theme),
          '&:focus': brandSurface(theme),
          '&.Mui-focusVisible': { outline: '2px solid currentColor', outlineOffset: -3 },
        }),
        ...(endpoint && {
          '&.Mui-selected': selectedSurface(theme),
        }),
      })}
    />
  );
};

export default AppCalendarDay;
