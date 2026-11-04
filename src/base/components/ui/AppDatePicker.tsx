'use client';

import { useId, useState, type ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { enUS, viVN } from '@mui/x-date-pickers/locales';
import { useLocale, useTranslations } from 'next-intl';
import 'dayjs/locale/vi';
import AppPickerField from './AppPickerField';
import AppDialog from './AppDialog';
import AppButton from './AppButton';
import AppCalendarDay, { AppCalendarRangeContext } from './AppCalendarDay';
import { parseCalendarDate, selectCalendarRange, type CalendarRange } from '@/base/utils/calendar';

interface CommonDatePickerProps {
  label: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: ReactNode;
  minDate?: string;
  maxDate?: string;
}

export type AppDatePickerProps = CommonDatePickerProps & (
  | { mode?: 'single'; value: string; onChange: (value: string) => void }
  | { mode: 'range'; value: CalendarRange; onChange: (value: CalendarRange) => void }
);

const AppDatePicker = (props: AppDatePickerProps) => {
  const { label, disabled, required, error, helperText, minDate, maxDate } = props;
  const locale = useLocale();
  const t = useTranslations('calendar');
  const dialogId = useId();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<CalendarRange>(['', '']);
  const range = props.mode === 'range';
  const dates = range ? props.value : [props.value, ''];
  const display = dates.filter(Boolean).map((date) => parseCalendarDate(date)?.format('DD/MM/YYYY') ?? '').join(' – ');
  const validDraft = !!parseCalendarDate(draft[0]) && (!range || (!!parseCalendarDate(draft[1]) && draft[1] >= draft[0]))
    && (!minDate || draft[0] >= minDate) && (!maxDate || (draft[1] || draft[0]) <= maxDate);

  const openCalendar = () => {
    if (disabled) return;
    setDraft(range ? [...props.value] : [props.value, '']);
    setOpen(true);
  };
  const apply = () => {
    if (!validDraft || disabled) return;
    if (props.mode === 'range') props.onChange(draft);
    else props.onChange(draft[0]);
    setOpen(false);
  };

  return (
    <>
      <AppPickerField
        label={label}
        value={display}
        placeholder={range ? t('rangePlaceholder') : t('datePlaceholder')}
        disabled={disabled}
        required={required}
        error={error}
        helperText={helperText}
        open={open}
        dialogId={dialogId}
        onOpen={openCalendar}
        icon={<CalendarMonthRoundedIcon color="action" />}
      />
      <AppDialog
        open={open}
        onClose={() => setOpen(false)}
        title={label}
        maxWidth="xs"
        actions={<AppButton onClick={apply} disabled={!validDraft || disabled}>{t('apply')}</AppButton>}
      >
        {open && (
          <Box id={dialogId} sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography aria-live="polite" sx={{ fontSize: '14px', color: 'text.secondary' }}>
              {range
                ? draft[0] && draft[1]
                  ? `${parseCalendarDate(draft[0])?.format('DD/MM/YYYY')} – ${parseCalendarDate(draft[1])?.format('DD/MM/YYYY')}`
                  : t(draft[0] ? 'selectEnd' : 'selectStart')
                : draft[0] ? parseCalendarDate(draft[0])?.format('DD/MM/YYYY') : t('selectDate')}
            </Typography>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={locale === 'vi' ? 'vi' : 'en'}
              localeText={(locale === 'vi' ? viVN : enUS).components.MuiLocalizationProvider.defaultProps.localeText}
            >
              <AppCalendarRangeContext.Provider value={{ start: draft[0], end: range ? draft[1] : '' }}>
                <DateCalendar
                  // A null value lets a second click on the start day select a one-day range.
                  value={null}
                  referenceDate={parseCalendarDate(draft[0]) ?? undefined}
                  onChange={(date, selectionState) => {
                    if (selectionState !== 'finish' || !date?.isValid()) return;
                    const next = date.format('YYYY-MM-DD');
                    setDraft((previous) => range ? selectCalendarRange(previous, next) : [next, '']);
                  }}
                  minDate={parseCalendarDate(minDate) ?? undefined}
                  maxDate={parseCalendarDate(maxDate) ?? undefined}
                  disabled={disabled}
                  showDaysOutsideCurrentMonth
                  fixedWeekNumber={6}
                  dayOfWeekFormatter={(date) => date.format('dd')}
                  views={['year', 'month', 'day']}
                  slots={{ day: AppCalendarDay }}
                  sx={{
                    width: '100%', minWidth: 0, maxHeight: 'none', height: 'auto',
                    '& .MuiDayCalendar-header, & .MuiDayCalendar-weekContainer': { gap: 0 },
                    '& .MuiDayCalendar-weekDayLabel': { flex: 1, maxWidth: 44, m: 0 },
                    '& .MuiPickersCalendarHeader-root': { px: 0 },
                    '& .MuiDayCalendar-slideTransition': { minHeight: 264 },
                  }}
                />
              </AppCalendarRangeContext.Provider>
            </LocalizationProvider>
          </Box>
        )}
      </AppDialog>
    </>
  );
};

export default AppDatePicker;
