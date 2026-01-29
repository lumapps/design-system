import { Avatar, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <>
        <Avatar theme={theme} image="/demo-assets/persona.png" alt="XS" size="xs" />
        <Avatar theme={theme} image="/demo-assets/persona.png" alt="S" size="s" />
        <Avatar theme={theme} image="/demo-assets/persona.png" alt="M" size="m" />
        <Avatar theme={theme} image="/demo-assets/persona.png" alt="L" size="l" />
        <Avatar theme={theme} image="/demo-assets/persona.png" alt="XL" size="xl" />
    </>
);
