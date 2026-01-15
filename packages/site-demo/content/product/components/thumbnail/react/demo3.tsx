import { Thumbnail } from '@lumx/react';

export default () => (
    <Thumbnail
        image="/demo-assets/landscape3.jpg"
        alt="Square"
        size="xl"
        aspectRatio="wide"
        objectFit="contain"
        style={{ background: 'black' }}
    />
);
