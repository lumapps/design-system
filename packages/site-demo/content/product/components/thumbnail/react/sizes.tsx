import { Size, Thumbnail } from '@lumx/react';

export const App = () => (
    <>
        <Thumbnail image="/demo-assets/square2.jpg" alt="xxs" size={Size.xxs} />
        <Thumbnail image="/demo-assets/square2.jpg" alt="xs" size={Size.xs} />
        <Thumbnail image="/demo-assets/square2.jpg" alt="s" size={Size.s} />
        <Thumbnail image="/demo-assets/square2.jpg" alt="m" size={Size.m} />
        <Thumbnail image="/demo-assets/square2.jpg" alt="l" size={Size.l} />
        <Thumbnail image="/demo-assets/square2.jpg" alt="xl" size={Size.xl} />
        <div style={{ width: 300 }}>
            <Thumbnail image="/demo-assets/square2.jpg" alt="free" />
        </div>
    </>
);
