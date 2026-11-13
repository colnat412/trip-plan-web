'use client';

import { useId, useState, type MouseEvent, type ReactNode } from 'react';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';

export interface AppActionMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

export interface AppActionMenuProps {
  items: AppActionMenuItem[];
  trigger?: ReactNode;
  triggerIcon?: ReactNode;
  size?: 'small' | 'medium';
  ariaLabel?: string;
  minTouchTarget?: boolean;
}

const AppActionMenu = ({
  items,
  trigger,
  triggerIcon,
  size = 'small',
  ariaLabel = 'Actions menu',
  minTouchTarget = false,
}: AppActionMenuProps) => {
  const menuId = useId();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event?: MouseEvent) => {
    event?.stopPropagation();
    setAnchorEl(null);
  };

  const handleItemClick = (item: AppActionMenuItem, event: MouseEvent) => {
    event.stopPropagation();
    handleClose();
    item.onClick();
  };

  return (
    <>
      {trigger ? (
        <span onClick={handleOpen} style={{ display: 'inline-flex' }}>
          {trigger}
        </span>
      ) : (
        <IconButton
          size={size}
          onClick={handleOpen}
          aria-label={ariaLabel}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
          sx={{
            ...(minTouchTarget && { width: 44, height: 44 }),
            color: 'text.secondary',
            '&:hover': {
              color: 'text.primary',
              bgcolor: 'action.hover',
            },
          }}
        >
          {triggerIcon ?? <MoreVertRoundedIcon fontSize={size} />}
        </IconButton>
      )}

      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={(_e) => handleClose(_e as unknown as MouseEvent)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 160,
              borderRadius: 'var(--app-radius-card)',
              p: 0.5,
              border: 1,
              borderColor: 'divider',
            },
          },
        }}
      >
        {items.map((item) => (
          <MenuItem
            key={item.id}
            disabled={item.disabled}
            onClick={(e) => handleItemClick(item, e)}
            sx={{
              borderRadius: 'var(--app-radius-small)',
              py: 0.85,
              px: 1.5,
              gap: 1.25,
              color: (theme) => {
                const palette = theme.vars?.palette ?? theme.palette;
                return item.danger ? palette.error.main : 'text.primary';
              },
              '&:hover': {
                bgcolor: item.danger
                  ? 'rgba(239, 68, 68, 0.08)'
                  : 'action.hover',
              },
            }}
          >
            {item.icon && (
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  color: (theme) => {
                    const palette = theme.vars?.palette ?? theme.palette;
                    return item.danger ? palette.error.main : 'text.secondary';
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
            )}
            <ListItemText
              primary={
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: item.danger ? 700 : 500,
                  }}
                >
                  {item.label}
                </Typography>
              }
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default AppActionMenu;
