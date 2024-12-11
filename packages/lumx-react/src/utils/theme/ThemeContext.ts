import React from 'react';
import type { Theme } from '@lumx/react';

type ThemeContextValue = Theme | undefined;
export const ThemeContext = React.createContext<ThemeContextValue>(undefined);

/** Provide a theme context to all children. */
export const ThemeProvider = ThemeContext.Provider as React.FC<{
    value: ThemeContextValue;
    children?: React.ReactNode;
}>;

/** Get the theme in the current context. */
export function useTheme(): ThemeContextValue {
    return React.useContext(ThemeContext);
}
