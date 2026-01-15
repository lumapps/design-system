import { Thumbnail } from '@lumx/react';

export default () => (
    <>
        <div style={{ width: 100, height: 10 }}>
            <Thumbnail image="/demo-assets/landscape2.jpg" alt="Free" aspectRatio="free" fillHeight />
        </div>

        <div style={{ width: 100 }}>
            <Thumbnail image="/demo-assets/landscape2.jpg" alt="Horizontal" aspectRatio="horizontal" />
        </div>

        <div style={{ width: 100 }}>
            <Thumbnail image="/demo-assets/landscape2.jpg" alt="Original" aspectRatio="original" />
        </div>

        <div style={{ width: 100 }}>
            <Thumbnail image="/demo-assets/landscape2.jpg" alt="Square" aspectRatio="square" />
        </div>

        <div style={{ width: 100 }}>
            <Thumbnail image="/demo-assets/landscape2.jpg" alt="Vertical" aspectRatio="vertical" />
        </div>

        <div style={{ width: 100 }}>
            <Thumbnail image="/demo-assets/landscape2.jpg" alt="Wide" aspectRatio="wide" />
        </div>
    </>
);
