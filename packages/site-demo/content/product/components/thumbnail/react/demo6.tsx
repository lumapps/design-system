import { Thumbnail, Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <Thumbnail
        isLoading
        image="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII="
        alt="loading image"
        aspectRatio="square"
        size="xl"
        variant="rounded"
        theme={theme}
    />
);
