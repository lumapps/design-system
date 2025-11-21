import { Mosaic, ThumbnailProps } from '@lumx/react';

const IMAGES: ThumbnailProps[] = [
    { image: '/demo-assets/landscape1.jpg', alt: 'Landscape 1' },
    { image: '/demo-assets/portrait1.jpg', alt: 'Portrait 1' },
    { image: '/demo-assets/portrait2.jpg', alt: 'Portrait 2' },
    { image: '/demo-assets/portrait3.jpg', alt: 'Portrait 3' },
];

export const App = () => {
    return (
        <div style={{ width: 250 }}>
            <Mosaic thumbnails={IMAGES} />
        </div>
    );
};
