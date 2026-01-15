import { Thumbnail } from '@lumx/react';

export default () => (
    <>
        <Thumbnail image="/demo-assets/landscape3.jpg" alt="Landscape" aspectRatio="original" size="xl" />

        <Thumbnail
            image="/demo-assets/portrait3.jpg"
            alt="Portrait"
            aspectRatio="vertical"
            size="xl"
            variant="rounded"
        />

        <Thumbnail alt="Square" image="/demo-assets/square1.jpg" aspectRatio="square" size="l" />
    </>
);
