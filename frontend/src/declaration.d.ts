declare module '*.jpg';
declare module '*.png';
declare module '*.svg';
declare module '*.jpeg';

declare module 'recharts/lib/component/DefaultTooltipContent' {
  import React from 'react';
  import { TooltipProps } from 'recharts';

  const DefaultTooltipContent: React.ComponentType<TooltipProps<number, string>>;
}
