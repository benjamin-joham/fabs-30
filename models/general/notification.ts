import { ReactNode } from 'react';
import { GenericValues } from './generic-values';

export const NOTIFICATION_TYPE = {
  Success: 'SUCCESS',
  Warning: 'WARNING',
  Error: 'ERROR',
  Info: 'INFO',
};

type NotificationType = GenericValues<typeof NOTIFICATION_TYPE>;

export type Notification = {
  id: string;
  message: ReactNode;
  type: NotificationType;
};
