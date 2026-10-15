import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Box, Stack, Typography } from '@mui/material';
import { POLICY_IDS, type PolicyId } from '@/features/legal/constants';
import PolicyDocument from '@/features/legal/components/PolicyDocument';

const LegalPage = async ({
  params,
}: {
  params: Promise<{ policy: string }>;
}) => {
  const { policy } = await params;
  if (!POLICY_IDS.includes(policy as PolicyId)) notFound();
  const policyId = policy as PolicyId;
  const t = await getTranslations('legal');
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100dvh',
        bgcolor: 'background.paper',
        color: 'text.primary',
        display: 'flex',
        justifyContent: 'center',
        p: { xs: '16px', sm: '32px' },
      }}
    >
      <Stack spacing={3} sx={{ width: '100%', maxWidth: '720px' }}>
        <Typography component="h1" sx={{ fontSize: '28px', fontWeight: 800 }}>
          {t(`documents.${policyId}.title`)}
        </Typography>
        <PolicyDocument policy={policyId} />
      </Stack>
    </Box>
  );
};

export default LegalPage;
