import { useEffect, useRef } from 'react';
import { ThemeProvider } from '@lumx/react';
import { PortalProvider } from '@lumx/react/utils';

export const withGlobalProviders = (Story, context) => {
    const theme = context.args.theme || context.globals.theme || undefined;
    const containerRef = useRef(null);

    useEffect(() => {
        // Update document with 'theme-dark' class
        document.documentElement.classList.toggle('theme-dark', theme === 'dark');
    }, [theme]);

    return (
        <lumx-story ref={containerRef}>
            <ThemeProvider value={theme}>
                <PortalProvider value={() => ({ container: containerRef.current })}>
                    <Story />
                </PortalProvider>
            </ThemeProvider>
        </lumx-story>
    );
};
