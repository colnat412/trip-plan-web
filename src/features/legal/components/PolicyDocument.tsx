import { Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { POLICY_VERSION, type PolicyId } from '../constants';

const PolicyDocument = ({ policy }: { policy: PolicyId }) => {
  const t = useTranslations('legal');
  return (
    <Stack spacing={2}>
      {/* <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
        {t('version', { version: POLICY_VERSION })}
      </Typography> */}
      {(['scope', 'responsibility', 'handling', 'choices'] as const).map(
        (section) => (
          <Stack key={section} spacing={0.75}>
            <Typography
              component="h2"
              sx={{ fontSize: '16px', fontWeight: 700 }}
            >
              {t(`documents.${policy}.${section}.title`)}
            </Typography>
            <Typography
              sx={{ fontSize: '14px', lineHeight: 1.8, whiteSpace: 'pre-line' }}
            >
              {t(`documents.${policy}.${section}.body`)}
            </Typography>
          </Stack>
        ),
      )}
    </Stack>
  );
};

export default PolicyDocument;
