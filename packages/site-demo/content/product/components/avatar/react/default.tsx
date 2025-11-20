import { Avatar, Size } from '@lumx/react';

export const App = ({ theme }: any) => (
    <>
        <Avatar theme={theme} image="/demo-assets/persona.png" alt="XS" size={Size.xs} />
        <Avatar theme={theme} image="/demo-assets/persona.png" alt="S" size={Size.s} />
        <Avatar theme={theme} image="/demo-assets/persona.png" alt="M" size={Size.m} />
        <Avatar theme={theme} image="/demo-assets/persona.png" alt="L" size={Size.l} />
        <Avatar theme={theme} image="/demo-assets/persona.png" alt="XL" size={Size.xl} />
    </>
);
