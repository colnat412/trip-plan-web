import { Box } from '@mui/material';

const TemplatesLayout = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      minHeight: '100%',
      bgcolor: 'background.paper',
      color: 'text.primary',
    }}
  >
    {children}
  </Box>
);
export default TemplatesLayout;
