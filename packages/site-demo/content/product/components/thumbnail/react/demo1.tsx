import { Thumbnail } from '@lumx/react';

export default () => (
    <>
        <Thumbnail image="/demo-assets/square2.jpg" alt="xxs" size="xxs" />
        <Thumbnail image="/demo-assets/square2.jpg" alt="xs" size="xs" />
        <Thumbnail image="/demo-assets/square2.jpg" alt="s" size="s" />
        <Thumbnail image="/demo-assets/square2.jpg" alt="m" size="m" />
        <Thumbnail image="/demo-assets/square2.jpg" alt="l" size="l" />
        <Thumbnail image="/demo-assets/square2.jpg" alt="xl" size="xl" />
        <div style={{ width: 300 }}>
            <Thumbnail image="/demo-assets/square2.jpg" alt="free" />
        </div>
    </>
);
