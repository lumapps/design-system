import { Thumbnail } from '@lumx/react';

export default () => (
    <>
        <div style={{ width: 100, height: 10 }}>
            <Thumbnail image="https://picsum.photos/id/535/640/480" alt="Free" aspectRatio="free" fillHeight />
        </div>

        <div style={{ width: 100 }}>
            <Thumbnail image="https://picsum.photos/id/535/640/480" alt="Horizontal" aspectRatio="horizontal" />
        </div>

        <div style={{ width: 100 }}>
            <Thumbnail image="https://picsum.photos/id/535/640/480" alt="Original" aspectRatio="original" />
        </div>

        <div style={{ width: 100 }}>
            <Thumbnail image="https://picsum.photos/id/535/640/480" alt="Square" aspectRatio="square" />
        </div>

        <div style={{ width: 100 }}>
            <Thumbnail image="https://picsum.photos/id/535/640/480" alt="Vertical" aspectRatio="vertical" />
        </div>

        <div style={{ width: 100 }}>
            <Thumbnail image="https://picsum.photos/id/535/640/480" alt="Wide" aspectRatio="wide" />
        </div>
    </>
);
