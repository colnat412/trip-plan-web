'use client';

import { createContext, useContext } from 'react';
import { PickerDay, type PickerDayProps } from '@mui/x-date-pickers/PickerDay';

export const AppCalendarRangeContext = createContext({ start: '', end: '' });

const AppCalendarDay = (props: PickerDayProps) => {
  const { start, end } = useContext(AppCalendarRangeContext);
  const date = props.day.format('YYYY-MM-DD');
  const endpoint = date === start || date === end;
  const withinRange = !!start && !!end && date >= start && date <= end;

  return (
    <PickerDay
      {...props}
      selected={endpoint}
      aria-selected={endpoint || withinRange}
      sx={(theme) => ({
        '--PickerDay-horizontalMargin': '0px',
        flex: 1,
        maxWidth: 44,
        height: 40,
        borderRadius: 'var(--app-radius-control)',
        ...(withinRange && !endpoint && {
          borderRadius: 0,
          bgcolor: 'action.selected',
          '&:hover': { bgcolor: 'action.hover' },
        }),
        ...(endpoint && {
          '&.Mui-selected, &.Mui-selected:hover, &.Mui-selected:focus': {
            bgcolor: (theme.vars?.palette ?? theme.palette).primary.main,
            color: (theme.vars?.palette ?? theme.palette).primary.contrastText,
          },
        }),
      })}
    />
  );
};

export default AppCalendarDay;
