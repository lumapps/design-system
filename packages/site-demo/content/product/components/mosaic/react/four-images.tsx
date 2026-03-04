import { Mosaic } from '@lumx/react';

export default () => (
    <div style={{ width: 250 }}>
        <Mosaic
            thumbnails={[
                { image: 'https://picsum.photos/id/256/800/546', alt: 'Landscape 1' },
                { image: 'https://picsum.photos/id/653/275/500', alt: 'Portrait 1' },
                { image: 'https://picsum.photos/id/670/350/500', alt: 'Portrait 2' },
                { image: 'https://picsum.photos/id/885/300/500', alt: 'Portrait 3' },
            ]}
        />
    </div>
);
