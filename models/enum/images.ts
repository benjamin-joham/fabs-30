import { GenericValues } from '@/models/general/generic-values';

export interface ImageSizes {
  xxs?: number;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  fallback?: number;
  [key: number]: number;
}

export const IMAGE_POSITION = {
  POSITION_LEFT: 'POSITON_LEFT',
  POSITION_RIGHT: 'POSITION_RIGHT',
} as const;

export type ImagePosition = GenericValues<typeof IMAGE_POSITION>;

export const IMAGE_WIDTH = {
  COL_3: 'COL_3',
  COL_4: 'COL_4',
  COL_6: 'COL_6',
  COL_12: 'COL_12',
} as const;

export type ImageWidth = GenericValues<typeof IMAGE_WIDTH>;
