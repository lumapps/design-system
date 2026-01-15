import { Mosaic } from '@lumx/react';

export default () => (
    <div style={{ width: 250 }}>
        <Mosaic
            thumbnails={[
                { image: '/demo-assets/portrait1.jpg', alt: 'Portrait 1' },
                { image: '/demo-assets/portrait2.jpg', alt: 'Portrait 2' },
            ]}
        />
    </div>
);
