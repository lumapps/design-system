import { useEffect } from 'react';
import { ThemeProvider } from '@lumx/react';

export const withGlobalTheme = (Story, context) => {
    const theme = context.args.theme || context.globals.theme || undefined;

    useEffect(() => {
        // Update document with 'theme-dark' class
        document.documentElement.classList.toggle('theme-dark', theme === 'dark');
    }, [theme]);

    return (
        <ThemeProvider value={theme}>
            <Story />
        </ThemeProvider>
    );
};
