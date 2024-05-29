import { GenericValues } from '@/models/general/generic-values';

export const COLUMN_SIZE = {
  COL_1: 'COL_1',
  COL_2: 'COL_2',
  COL_3: 'COL_3',
  COL_4: 'COL_4',
} as const;

export type ColumnSize = GenericValues<typeof COLUMN_SIZE>;
