import { Thumbnail } from '@lumx/react';

export default () => (
    <>
        <Thumbnail image="https://picsum.photos/id/511/300/300" alt="xxs" size="xxs" />
        <Thumbnail image="https://picsum.photos/id/511/300/300" alt="xs" size="xs" />
        <Thumbnail image="https://picsum.photos/id/511/300/300" alt="s" size="s" />
        <Thumbnail image="https://picsum.photos/id/511/300/300" alt="m" size="m" />
        <Thumbnail image="https://picsum.photos/id/511/300/300" alt="l" size="l" />
        <Thumbnail image="https://picsum.photos/id/511/300/300" alt="xl" size="xl" />
        <div style={{ width: 300 }}>
            <Thumbnail image="https://picsum.photos/id/511/300/300" alt="free" />
        </div>
    </>
);
