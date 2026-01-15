import { ThemeProvider, Button, Chip, Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <ThemeProvider value={theme}>
        <Button>Button</Button>
        <Chip>Chip</Chip>
    </ThemeProvider>
);
