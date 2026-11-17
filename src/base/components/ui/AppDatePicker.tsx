'use client';

import { useId, useState, type ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { enUS, viVN } from '@mui/x-date-pickers/locales';
import { useLocale, useTranslations } from 'next-intl';
import 'dayjs/locale/vi';
import AppPickerField from './AppPickerField';
import AppDialog from './AppDialog';
import AppButton from './AppButton';
import AppSegmentedControl from './AppSegmentedControl';
import AppCalendarDay, { AppCalendarRangeContext } from './AppCalendarDay';
import { parseCalendarDate, selectCalendarRange, type CalendarRange } from '@/base/utils/calendar';
import { parsePickerTime } from '@/base/utils/time';

interface CommonDatePickerProps {
  label: string;
  inline?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: ReactNode;
  minDate?: string;
  maxDate?: string;
}

export type AppDatePickerProps = CommonDatePickerProps & (
  | { mode?: 'single'; value: string; onChange: (value: string) => void; includeTime?: boolean }
  | { mode: 'range'; value: CalendarRange; onChange: (value: CalendarRange) => void }
);

const AppDatePicker = (props: AppDatePickerProps) => {
  const { label, disabled, required, error, helperText, minDate, maxDate, inline = false } = props;
  const locale = useLocale();
  const t = useTranslations('calendar');
  const dialogId = useId();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<CalendarRange>(['', '']);
  const [draftTime, setDraftTime] = useState('');
  const [activePart, setActivePart] = useState<'date' | 'time'>('date');
  const range = props.mode === 'range';
  const includeTime = props.mode !== 'range' && props.includeTime === true;
  const timeValue = includeTime ? props.value.slice(11, 16) || '00:00' : '';
  const dates = range ? props.value : [includeTime ? props.value.slice(0, 10) : props.value, ''];
  const selection: CalendarRange = inline ? [dates[0], dates[1]] : draft;
  const dateDisplay = dates.filter(Boolean).map((date) => parseCalendarDate(date)?.format('DD/MM/YYYY') ?? '').join(' – ');
  const display = includeTime && dateDisplay && timeValue ? `${dateDisplay} · ${timeValue.slice(0, 5)}` : dateDisplay;
  const validDraft = !!parseCalendarDate(draft[0]) && (!range || (!!parseCalendarDate(draft[1]) && draft[1] >= draft[0]))
    && (!minDate || draft[0] >= minDate) && (!maxDate || (draft[1] || draft[0]) <= maxDate)
    && (!includeTime || !!parsePickerTime(draftTime));

  const openCalendar = () => {
    if (disabled) return;
    setDraft([dates[0], dates[1]]);
    setDraftTime(timeValue);
    setActivePart('date');
    setOpen(true);
  };
  const apply = () => {
    if (!validDraft || disabled) return;
    if (props.mode === 'range') props.onChange(draft);
    else props.onChange(includeTime ? `${draft[0]}T${draftTime}:00` : draft[0]);
    setOpen(false);
  };

  const calendar = (
    <Box id={dialogId} role={inline ? 'group' : undefined} aria-label={inline ? label : undefined} sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
      {includeTime && (
        <AppSegmentedControl<'date' | 'time'>
          label={t('dateTimeSelection')}
          value={activePart}
          onChange={setActivePart}
          disabled={disabled}
          options={[
            { value: 'date', label: parseCalendarDate(selection[0])?.format('DD/MM/YYYY') || t('selectDate'), ariaLabel: t('selectDate') },
            { value: 'time', label: (inline ? timeValue.slice(0, 5) : draftTime) || t('selectTime'), ariaLabel: t('selectTime') },
          ]}
        />
      )}
      <Typography aria-live="polite" sx={{ fontSize: '14px', color: 'text.secondary' }}>
        {range
          ? selection[0] && selection[1]
            ? `${parseCalendarDate(selection[0])?.format('DD/MM/YYYY')} – ${parseCalendarDate(selection[1])?.format('DD/MM/YYYY')}`
            : t(selection[0] ? 'selectEnd' : 'selectStart')
          : selection[0] ? parseCalendarDate(selection[0])?.format('DD/MM/YYYY') : t('selectDate')}
      </Typography>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale={locale === 'vi' ? 'vi' : 'en'}
        localeText={(locale === 'vi' ? viVN : enUS).components.MuiLocalizationProvider.defaultProps.localeText}
      >
        {includeTime && activePart === 'time' ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex' }} aria-hidden="true">
              <Typography variant="caption" sx={{ flex: 1, textAlign: 'center' }}>{t('hours')}</Typography>
              <Typography variant="caption" sx={{ flex: 1, textAlign: 'center' }}>{t('minutes')}</Typography>
            </Box>
            <MultiSectionDigitalClock
              value={parsePickerTime(inline ? timeValue.slice(0, 5) : draftTime)}
              referenceDate={parsePickerTime('00:00')!}
              ampm={false}
              timeSteps={{ hours: 1, minutes: 1 }}
              views={['hours', 'minutes']}
              disabled={disabled}
              onChange={(time) => {
                if (!time?.isValid()) return;
                const nextTime = time.format('HH:mm');
                if (inline) props.onChange(`${dates[0]}T${nextTime}:00`);
                else setDraftTime(nextTime);
              }}
              sx={{ width: '100%', minWidth: 0,
                '& .MuiMultiSectionDigitalClockSection-root': { flex: 1, width: 'auto', minWidth: 0, px: 1, py: '4px', maxHeight: '208px' },
                '& .MuiMultiSectionDigitalClockSection-item': { width: '100%', m: 0, borderRadius: 'var(--app-radius-control)', minHeight: 40 },
              }}
            />
          </Box>
        ) : <AppCalendarRangeContext.Provider value={{ start: selection[0], end: range ? selection[1] : '' }}>
          <DateCalendar
            // A null value lets a second click on the start day select a one-day range.
            value={null}
            referenceDate={parseCalendarDate(selection[0]) ?? undefined}
            onChange={(date, selectionState) => {
              if (selectionState !== 'finish' || !date?.isValid()) return;
              const next = date.format('YYYY-MM-DD');
              if (inline) {
                if (props.mode === 'range') props.onChange(selectCalendarRange(selection, next));
                else props.onChange(includeTime ? `${next}T${timeValue}:00` : next);
              } else setDraft((previous) => range ? selectCalendarRange(previous, next) : [next, '']);
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
        </AppCalendarRangeContext.Provider>}
      </LocalizationProvider>
      {helperText && <Typography role={error ? 'alert' : undefined} variant="caption" color={error ? 'error' : 'text.secondary'}>{helperText}</Typography>}
    </Box>
  );
  if (inline) return calendar;

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
        {open && calendar}
      </AppDialog>
    </>
  );
};

export default AppDatePicker;
