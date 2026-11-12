'use client';

import { useId, useState, type ReactNode } from 'react';
import { Box, FormHelperText, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { enUS, viVN } from '@mui/x-date-pickers/locales';
import { useLocale, useTranslations } from 'next-intl';
import 'dayjs/locale/vi';
import AppButton from './AppButton';
import AppDialog from './AppDialog';
import AppPickerField from './AppPickerField';
import { formatPickerTimeRange, isTimeRangeValid, parsePickerTime, type TimeRange } from '@/base/utils/time';

interface CommonTimePickerProps {
  label: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: ReactNode;
  // Thay ô nhập mặc định bằng nút tuỳ ý (ví dụ nhãn giờ trên thẻ hoạt động).
  renderTrigger?: (context: {
    value: string;
    onOpen: () => void;
    open: boolean;
    dialogId: string;
    disabled?: boolean;
  }) => ReactNode;
}

export type AppTimePickerProps = CommonTimePickerProps & (
  | { mode?: 'single'; value: string; onChange: (value: string) => void }
  | { mode: 'range'; value: TimeRange; onChange: (value: TimeRange) => void }
);

const AppTimePicker = (props: AppTimePickerProps) => {
  const { label, disabled, required = false, error, helperText, renderTrigger } = props;
  const t = useTranslations('timePicker');
  const locale = useLocale();
  const dialogId = useId();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<TimeRange>(['', '']);
  const [active, setActive] = useState<0 | 1>(0);
  const range = props.mode === 'range';
  const valid = range ? isTimeRangeValid(draft, required)
    : (!required && !draft[0]) || !!parsePickerTime(draft[0]);
  const invalidOrder = !!draft[0] && !!draft[1] && draft[1] < draft[0];

  const openPicker = () => {
    if (disabled) return;
    setDraft(props.mode === 'range' ? [...props.value] : [props.value, '']);
    setActive(0);
    setOpen(true);
  };
  const apply = () => {
    if (!valid || disabled) return;
    if (props.mode === 'range') props.onChange(draft);
    else props.onChange(draft[0]);
    setOpen(false);
  };

  return (
    <>
      {renderTrigger ? renderTrigger({
        value: props.mode === 'range' ? formatPickerTimeRange(props.value) : props.value,
        onOpen: openPicker,
        open,
        dialogId,
        disabled,
      }) : (
        <AppPickerField
          label={label}
          value={props.mode === 'range' ? formatPickerTimeRange(props.value) : props.value}
          placeholder={range ? t('rangePlaceholder') : t('placeholder')}
          disabled={disabled}
          required={required}
          error={error}
          helperText={helperText}
          open={open}
          dialogId={dialogId}
          onOpen={openPicker}
          icon={<AccessTimeRoundedIcon color="action" />}
        />
      )}
      <AppDialog
        open={open}
        onClose={() => setOpen(false)}
        title={label}
        maxWidth="xs"
        actions={<AppButton onClick={apply} disabled={!valid || disabled}>{t('apply')}</AppButton>}
      >
        {open && (
          <Stack id={dialogId} spacing={2} sx={{ minWidth: 0 }}>
            {range && (
              <ToggleButtonGroup
                exclusive
                value={active}
                onChange={(_, next: 0 | 1 | null) => { if (next !== null) setActive(next); }}
                aria-label={t('rangeLabel')}
                disabled={disabled}
                sx={{ width: '100%', '& .MuiToggleButton-root': { flex: 1, minWidth: 0, py: 1, textTransform: 'none' } }}
              >
                {([0, 1] as const).map((index) => (
                  <ToggleButton key={index} value={index} aria-label={t(index === 0 ? 'start' : 'end')}>
                    <Stack spacing={0.5}>
                      <Typography variant="caption">{t(index === 0 ? 'start' : 'end')}</Typography>
                      <Typography sx={{ fontSize: '18px', fontWeight: 700 }}>{draft[index] || '--:--'}</Typography>
                    </Stack>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            )}
            <Stack spacing={0.5} sx={{ minWidth: 0 }}>
            <Box sx={{ display: 'flex' }} aria-hidden="true">
              <Typography sx={{ flex: 1, textAlign: 'center', fontSize: '13px', color: 'text.secondary' }}>{t('hours')}</Typography>
              <Typography sx={{ flex: 1, textAlign: 'center', fontSize: '13px', color: 'text.secondary' }}>{t('minutes')}</Typography>
            </Box>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={locale === 'vi' ? 'vi' : 'en'}
              localeText={(locale === 'vi' ? viVN : enUS).components.MuiLocalizationProvider.defaultProps.localeText}
            >
              <MultiSectionDigitalClock
                key={active}
                value={parsePickerTime(draft[active])}
                referenceDate={parsePickerTime('00:00')!}
                ampm={false}
                timeSteps={{ hours: 1, minutes: 1 }}
                views={['hours', 'minutes']}
                disabled={disabled}
                onChange={(time) => {
                  if (!time?.isValid()) return;
                  setDraft((previous) => {
                    const next: TimeRange = [...previous];
                    next[active] = time.format('HH:mm');
                    return next;
                  });
                }}
                sx={{
                  width: '100%', minWidth: 0,
                  // 5 dòng x 40px + đệm trên dưới 4px: không còn dòng bị cắt dở ở mép cột.
                  '& .MuiMultiSectionDigitalClockSection-root': { flex: 1, width: 'auto', minWidth: 0, px: 1, py: '4px', maxHeight: '208px' },
                  '& .MuiMultiSectionDigitalClockSection-item': { width: '100%', m: 0, borderRadius: '10px', minHeight: 40 },
                }}
              />
            </LocalizationProvider>
            </Stack>
            {invalidOrder && <FormHelperText error role="alert">{t('invalidOrder')}</FormHelperText>}
            {!required && (
              <AppButton
                intent="text"
                disabled={disabled || !draft[active]}
                onClick={() => setDraft((previous) => active === 0 ? ['', previous[1]] : [previous[0], ''])}
              >
                {t(range ? active === 0 ? 'clearStart' : 'clearEnd' : 'clear')}
              </AppButton>
            )}
          </Stack>
        )}
      </AppDialog>
    </>
  );
};

export default AppTimePicker;
