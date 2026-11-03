'use client';

import { forwardRef } from 'react';
import { Slide, type SlideProps } from '@mui/material';

const AppDialogSlide = forwardRef<unknown, SlideProps>((props, ref) => (
  <Slide {...props} ref={ref} direction="up" />
));

AppDialogSlide.displayName = 'AppDialogSlide';

export default AppDialogSlide;
