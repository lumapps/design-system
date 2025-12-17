import { AspectRatio, Thumbnail } from '@lumx/react';

export const App = () => (
    <>
        <div style={{ width: 100, height: 10 }}>
            <Thumbnail image="/demo-assets/landscape2.jpg" alt="Free" aspectRatio={AspectRatio.free} fillHeight />
        </div>

        <div style={{ width: 100 }}>
            <Thumbnail image="/demo-assets/landscape2.jpg" alt="Horizontal" aspectRatio={AspectRatio.horizontal} />
        </div>

        <div style={{ width: 100 }}>
            <Thumbnail image="/demo-assets/landscape2.jpg" alt="Original" aspectRatio={AspectRatio.original} />
        </div>

        <div style={{ width: 100 }}>
            <Thumbnail image="/demo-assets/landscape2.jpg" alt="Square" aspectRatio={AspectRatio.square} />
        </div>

        <div style={{ width: 100 }}>
            <Thumbnail image="/demo-assets/landscape2.jpg" alt="Vertical" aspectRatio={AspectRatio.vertical} />
        </div>

        <div style={{ width: 100 }}>
            <Thumbnail image="/demo-assets/landscape2.jpg" alt="Wide" aspectRatio={AspectRatio.wide} />
        </div>
    </>
);
