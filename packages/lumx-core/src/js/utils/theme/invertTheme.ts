import { Theme } from '@lumx/core/js/constants';

/** Invert the color of the given theme. */
export const invertTheme = (theme: Theme): Theme => (theme === 'light' ? 'dark' : 'light');
