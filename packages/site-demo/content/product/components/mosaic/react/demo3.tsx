import { Mosaic } from '@lumx/react';

export default () => (
    <div style={{ width: 250 }}>
        <Mosaic
            thumbnails={[
                { image: '/demo-assets/landscape1.jpg', alt: 'Landscape 1' },
                { image: '/demo-assets/portrait1.jpg', alt: 'Portrait 1' },
                { image: '/demo-assets/portrait2.jpg', alt: 'Portrait 2' },
                { image: '/demo-assets/portrait3.jpg', alt: 'Portrait 3' },
            ]}
        />
    </div>
);
