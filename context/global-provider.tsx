import React, { ReactNode } from 'react';
import QueryProvider from '@/context/query-provider';
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from '@mantine/modals';
import { theme } from '@/theme';
type Properties = {
  children: ReactNode;
};

export default function GlobalProvider({ children }: Properties) {
  return (
    <QueryProvider>
      <MantineProvider theme={theme}>
        <ModalsProvider>{children}</ModalsProvider>
      </MantineProvider>
    </QueryProvider>
  );
}
