import { ThemeProvider, Flag, useTheme, Theme } from '@lumx/react';

function MyComponent() {
    const theme = useTheme();
    return <Flag theme={theme} label={`Current theme: ${theme}`} />;
}

export default ({ theme }: { theme?: Theme }) => (
    <ThemeProvider value={theme}>
        <MyComponent />
    </ThemeProvider>
);
