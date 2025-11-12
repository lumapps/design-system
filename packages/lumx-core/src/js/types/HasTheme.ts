import type { Theme } from '../constants';

export interface HasTheme {
    /**
     * Theme adapting the component to light or dark background.
     */
    theme?: Theme;
}
