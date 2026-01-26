import { Thumbnail } from '@lumx/react';

export default () => (
    <>
        <Thumbnail image="https://picsum.photos/id/24/640/480" alt="Landscape" aspectRatio="original" size="xl" />

        <Thumbnail
            image="https://picsum.photos/id/885/300/500"
            alt="Portrait"
            aspectRatio="vertical"
            size="xl"
            variant="rounded"
        />

        <Thumbnail alt="Square" image="https://picsum.photos/id/1/128/128" aspectRatio="square" size="l" />
    </>
);
