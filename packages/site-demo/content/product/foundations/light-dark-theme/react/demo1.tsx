import { Button, Chip, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <>
        <Button theme={theme}>Button</Button>
        <Chip theme={theme}>Chip</Chip>
    </>
);
