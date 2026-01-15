import { Thumbnail, Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <Thumbnail
        image="brokenurl.jpg"
        alt="broken url image"
        aspectRatio="square"
        size="xl"
        variant="rounded"
        theme={theme}
    />
);
