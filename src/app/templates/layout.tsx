import { Box } from '@mui/material';

interface TemplatesLayoutProps { children: React.ReactNode }

const TemplatesLayout = ({ children }: TemplatesLayoutProps) => (
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
