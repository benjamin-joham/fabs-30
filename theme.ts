"use client";

import { createTheme, DEFAULT_THEME, mergeMantineTheme } from "@mantine/core";

const themeOverride = createTheme({
  primaryColor: 'blue',
  defaultRadius: 5,
  fontSizes: {
    xs: '12px',
    sm: '16px',
    md: '24px',
    lg: '36px',
    xl: '48px',
  },
  lineHeights: {
    xs: '16px',
    sm: '24px',
    md: '32px',
    lg: '48px',
    xl: '64px',
  },
});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);