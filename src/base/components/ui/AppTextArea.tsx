'use client';

import AppTextField, { type AppTextFieldProps } from './AppTextField';

export interface AppTextAreaProps extends AppTextFieldProps {
  minRows?: number;
  maxRows?: number;
}

const AppTextArea = ({
  minRows = 4,
  maxRows = 8,
  ...textAreaProps
}: AppTextAreaProps) => {
  return (
    <AppTextField
      {...textAreaProps}
      multiline
      minRows={minRows}
      maxRows={maxRows}
    />
  );
};

export default AppTextArea;
