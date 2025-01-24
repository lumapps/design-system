import type { Theme } from '@lumx/react';

/** Invert the color of the given theme. */
export const invertTheme = (theme: Theme): Theme => (theme === 'light' ? 'dark' : 'light');
