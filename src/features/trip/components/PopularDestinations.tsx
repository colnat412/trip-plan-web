'use client';

import Image from 'next/image';
import { ButtonBase, Stack, Typography } from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { POPULAR_DESTINATIONS, getDestinationPhoto } from '../data/destination-photos';

interface PopularDestinationsProps {
  value: string;
  onChange: (name: string) => void;
  disabled?: boolean;
}

export default function PopularDestinations({ value, onChange, disabled = false }: PopularDestinationsProps) {
  return <Stack>
    <Stack component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
      {POPULAR_DESTINATIONS.map(place => {
        const selected = getDestinationPhoto(value) === place.image;
        return <Stack component="li" key={place.name} sx={{ borderBottom: 1, borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}>
          <ButtonBase disabled={disabled} aria-pressed={selected} onClick={() => onChange(place.name)} sx={{
            width: '100%', gap: 1.5, py: 1.25, px: 0.5, textAlign: 'left', justifyContent: 'flex-start',
            bgcolor: selected ? 'action.selected' : 'transparent',
            '&:hover': { bgcolor: 'action.hover' },
            '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2 },
          }}>
            <Image src={place.image} alt="" width={64} height={52} style={{ objectFit: 'cover', borderRadius: 'var(--app-radius-small)', flexShrink: 0 }} />
            <Typography sx={{ flex: 1, minWidth: 0, fontWeight: selected ? 700 : 600, overflowWrap: 'anywhere' }}>{place.name}</Typography>
            {selected ? <CheckRoundedIcon color="primary" /> : <ChevronRightRoundedIcon sx={{ color: 'text.secondary' }} />}
          </ButtonBase>
        </Stack>;
      })}
    </Stack>
  </Stack>;
}
