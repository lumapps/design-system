import { Thumbnail } from '@lumx/react';

export default () => (
    <Thumbnail
        image="https://picsum.photos/id/24/640/480"
        alt="Square"
        size="xl"
        aspectRatio="wide"
        objectFit="contain"
        style={{ background: 'black' }}
    />
);
