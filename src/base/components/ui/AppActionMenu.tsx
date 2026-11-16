'use client';

import { useId, useState, type MouseEvent, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { waitForMobileOverlayHistory } from '@/base/hooks/use-mobile-overlay-back';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  useMediaQuery,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useTheme } from '@mui/material/styles';
import AppDialog from './AppDialog';
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
  sheetTitle?: string;
  minTouchTarget?: boolean;
}

const AppActionMenu = ({
  items,
  trigger,
  triggerIcon,
  size = 'small',
  ariaLabel,
  sheetTitle,
  minTouchTarget = false,
}: AppActionMenuProps) => {
  const menuId = useId();
  const t = useTranslations('dialog');
  const menuLabel = ariaLabel ?? t('actions');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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

  const handleItemClick = async (item: AppActionMenuItem, event: MouseEvent) => {
    event.stopPropagation();
    if (isMobile) {
      // Complete the sheet's Back entry before an action opens a page or another overlay.
      flushSync(() => handleClose());
      await waitForMobileOverlayHistory();
    } else {
      handleClose();
    }
    item.onClick();
  };

  const menuItems = items.map((item) => (
    <MenuItem
      key={item.id}
      disabled={item.disabled}
      onClick={(e) => handleItemClick(item, e)}
      sx={{
        borderRadius: 'var(--app-radius-small)',
        py: 0.85,
        minHeight: 44,
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
  ));

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
          aria-label={menuLabel}
          aria-haspopup={isMobile ? "dialog" : "menu"}
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

      {isMobile ? (
        <AppDialog open={open} onClose={handleClose} title={sheetTitle ?? menuLabel} showSheetHandle>
          <MenuList id={menuId} autoFocusItem sx={{ p: 0 }}>
            {menuItems}
          </MenuList>
        </AppDialog>
      ) : <Menu
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
        {menuItems}
      </Menu>}
    </>
  );
};

export default AppActionMenu;
