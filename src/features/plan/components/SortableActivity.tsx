'use client';

import type { ReactNode } from 'react';
import { Box, IconButton } from '@mui/material';
import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableActivityProps {
  id: string;
  label: string;
  disabled: boolean;
  showHandle: boolean;
  children: (handle: ReactNode) => ReactNode;
}

export default function SortableActivity({ id, label, disabled, showHandle, children }: SortableActivityProps) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id, disabled });
  const handle = !showHandle ? undefined : (
    <IconButton
      ref={setActivatorNodeRef}
      {...attributes}
      {...(!disabled ? listeners : {})}
      aria-label={label}
      aria-disabled={disabled || undefined}
      title={label}
      sx={{ width: 44, height: 44, touchAction: 'none', cursor: disabled ? 'default' : 'grab', color: 'text.secondary', '&:active': { cursor: disabled ? 'default' : 'grabbing' } }}
    >
      <DragIndicatorRoundedIcon sx={{ fontSize: 20 }} />
    </IconButton>
  );
  return (
    <Box ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} sx={{ minWidth: 0, opacity: isDragging ? 0.3 : 1 }}>
      {children(handle)}
    </Box>
  );
}
