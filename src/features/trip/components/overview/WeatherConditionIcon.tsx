'use client';

import { SvgIcon, type SvgIconProps } from '@mui/material';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';
import FoggyIcon from '@mui/icons-material/Foggy';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ThunderstormOutlinedIcon from '@mui/icons-material/ThunderstormOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import type { WeatherCondition } from '../../types/weather';

const WeatherConditionIcon = ({ condition, ...props }: SvgIconProps & { condition: WeatherCondition }) => {
  if (condition === 'CLEAR') return <WbSunnyOutlinedIcon {...props} />;
  if (condition === 'CLOUDY') return <CloudOutlinedIcon {...props} />;
  if (condition === 'FOG') return <FoggyIcon {...props} />;
  if (condition === 'SNOW') return <AcUnitIcon {...props} />;
  if (condition === 'THUNDERSTORM') return <ThunderstormOutlinedIcon {...props} />;
  if (condition === 'PARTLY_CLOUDY' || condition === 'DRIZZLE' || condition === 'RAIN') {
    return (
      <SvgIcon {...props} viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          {condition === 'PARTLY_CLOUDY' && (
            <>
              <path d="M12 8a4 4 0 1 0-7 3M6 1v2M1 6h2M10 2l-1 2M2 2l1.5 1.5" />
            </>
          )}
          <path d="M6 17a4 4 0 1 1 .7-7.9A5.5 5.5 0 0 1 17 11a3 3 0 1 1 1 6H6Z" />
          {condition === 'DRIZZLE' && <path d="M8 20h.01M13 21h.01M18 20h.01" strokeWidth="2.5" />}
          {condition === 'RAIN' && <path d="m8 20-1 2m6-2-1 2m6-2-1 2" />}
        </g>
      </SvgIcon>
    );
  }
  return <HelpOutlineOutlinedIcon {...props} />;
};

export default WeatherConditionIcon;
