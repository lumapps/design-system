import React from 'react';

import uniqueId from 'lodash/uniqueId';

import { mdiAbTesting } from '@lumx/icons';
import {
    AspectRatio,
    Badge,
    Button,
    FlexBox,
    GridColumn,
    Icon,
    Size,
    Thumbnail,
    ThumbnailObjectFit,
} from '@lumx/react';
import { CustomLink } from '@lumx/react/stories/utils/CustomLink';
import { IMAGE_SIZES, IMAGES } from '@lumx/core/stories/controls/image';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { withNestedProps } from '@lumx/react/stories/decorators/withNestedProps';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import { setup } from '@lumx/core/js/components/Thumbnail/Stories';

const { meta, ...stories } = setup({
    component: Thumbnail,
    decorators: { withNestedProps },
    overrides: {
        Simple: {
            args: { image: IMAGES.landscape1s200 },
            decorators: [
                withWrapper({
                    style: { border: '1px dashed red', height: 500, width: 500, resize: 'both', overflow: 'hidden' },
                }),
            ],
        },
        FillHeightAndRatio: {
            args: { image: IMAGES.landscape1s200, fillHeight: true },
            decorators: [
                withWrapper({
                    style: { border: '1px dashed red', height: 500, width: 500, resize: 'both', overflow: 'hidden' },
                }),
                withCombinations({
                    combinations: { rows: { key: 'aspectRatio', options: withUndefined(AspectRatio) } },
                }),
            ],
        },
        ObjectFit: {
            args: { size: Size.xl },
            decorators: [
                withCombinations({
                    cellStyle: { border: '1px solid lightgray' },
                    combinations: {
                        cols: {
                            'Default (cover)': {},
                            contain: { objectFit: ThumbnailObjectFit.contain },
                        },
                        rows: {
                            'Ratio square': { aspectRatio: AspectRatio.square },
                            'Ratio wide': { aspectRatio: AspectRatio.wide },
                            'Ratio vertical': { aspectRatio: AspectRatio.vertical },
                        },
                        sections: {
                            'Portrait image': { image: IMAGES.portrait1 },
                            'Landscape image': { image: IMAGES.landscape1 },
                        },
                    },
                }),
                withWrapper({ maxColumns: 3, itemMinWidth: 350 }, GridColumn),
            ],
        },
    },
});

export default {
    title: 'LumX components/thumbnail/Thumbnail',
    ...meta,
};

export const Simple = { ...stories.Simple };
export const IsLoading = { ...stories.IsLoading };
export const WithoutSource = { ...stories.WithoutSource };

export const ErrorFallback = {
    args: { image: 'foo' },
    decorators: [
        withCombinations({
            combinations: {
                cols: {
                    Default: {},
                    'Icon fallback': { fallback: mdiAbTesting },
                    'Image fallback': { fallback: <img src="/logo.svg" alt="logo" /> },
                },
                rows: {
                    Default: {},
                    'Size xl & ratio wide': { size: Size.xl, aspectRatio: AspectRatio.wide },
                    'Size l & ratio vertical': { size: Size.l, aspectRatio: AspectRatio.vertical },
                },
            },
        }),
    ],
};

export const WithBadge = {
    args: {
        image: IMAGES.landscape1s200,
        size: Size.xl,
        badge: (
            <Badge color="green">
                <Icon icon={mdiAbTesting} />
            </Badge>
        ),
    },
    decorators: [
        withWrapper({
            style: { border: '1px dashed red', height: 500, width: 500, resize: 'both', overflow: 'hidden' },
        }),
    ],
};

export const FocusPointVertical = { ...stories.FocusPointVertical };
export const FocusPointHorizontal = { ...stories.FocusPointHorizontal };
export const AsButton = { ...stories.AsButton };
export const AsLink = { ...stories.AsLink };

export const AsCustomLink = {
    args: { image: IMAGES.landscape1s200, linkAs: CustomLink, linkProps: { href: 'https://example.com' } },
};

export const FillHeightAndRatio = { ...stories.FillHeightAndRatio };
export const WithSvgImages = { ...stories.WithSvgImages };

export const Original = () => (
    <>
        <h1>Ratio: Original</h1>
        <h2>Default</h2>
        <table>
            <thead>
                <tr>
                    <th>Landscape</th>
                    <th>
                        Landscape <small>(with original size)</small>
                    </th>
                    <th>Portrait</th>
                    <th>
                        Portrait <small>(with original size)</small>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <Thumbnail alt="landscape image" image={IMAGES.landscape1} />
                    </td>
                    <td>
                        <Thumbnail alt="landscape image" image={IMAGES.landscape1} imgProps={IMAGE_SIZES.landscape1} />
                    </td>
                    <td>
                        <Thumbnail alt="portrait image" image={IMAGES.portrait1} />
                    </td>
                    <td>
                        <Thumbnail alt="portrait image" image={IMAGES.portrait1} imgProps={IMAGE_SIZES.portrait1} />
                    </td>
                </tr>
            </tbody>
        </table>
        <h2>Constrained parent size</h2>
        <FlexBox orientation="horizontal" vAlign="center" gap="huge">
            <div className="parent" style={{ width: 220 }}>
                <Thumbnail alt="" image={IMAGES.landscape1} />
            </div>
            <div className="parent" style={{ width: 220 }}>
                <Thumbnail alt="" image={IMAGES.portrait1} />
            </div>
        </FlexBox>
        <h2>With size</h2>
        <FlexBox orientation="horizontal" vAlign="center" gap="huge">
            <Thumbnail alt="" image={IMAGES.landscape1} size="xxl" />
            <Thumbnail alt="" image={IMAGES.portrait1} size="xxl" />
        </FlexBox>
        <h2>With size & smaller image</h2>
        <FlexBox orientation="horizontal" vAlign="center" gap="huge">
            <Thumbnail alt="" image={IMAGES.landscape1s200} size="xxl" />
            <Thumbnail alt="" image={IMAGES.portrait1s200} size="xxl" />
        </FlexBox>
        <h2>With size & smaller image & fill height</h2>
        <FlexBox orientation="horizontal" vAlign="center" gap="huge">
            <Thumbnail alt="" image={IMAGES.landscape1s200} size="xxl" fillHeight />
            <Thumbnail alt="" image={IMAGES.portrait1s200} size="xxl" fillHeight />
        </FlexBox>
        <h2>Constrained parent size & smaller image & fill height</h2>
        <FlexBox orientation="horizontal" vAlign="center" gap="huge">
            <div className="parent" style={{ width: 220 }}>
                <Thumbnail alt="" image={IMAGES.landscape1s200} fillHeight />
            </div>
            <div className="parent" style={{ width: 220 }}>
                <Thumbnail alt="" image={IMAGES.portrait1s200} fillHeight />
            </div>
        </FlexBox>
    </>
);

export const Vertical = () => (
    <>
        <h1>Ratio: vertical</h1>
        <h2>Default</h2>
        <small>Unsupported use case (thumbnail size is undefined)</small>
        <FlexBox orientation="horizontal" vAlign="center" gap="huge">
            <Thumbnail alt="" aspectRatio="vertical" image={IMAGES.landscape1} />
            <Thumbnail alt="" aspectRatio="vertical" image={IMAGES.portrait1} />
        </FlexBox>
        <h2>Constraint parent size</h2>
        <FlexBox orientation="horizontal" vAlign="center" gap="huge">
            <div className="parent" style={{ width: 220 }}>
                <Thumbnail alt="" aspectRatio="vertical" image={IMAGES.landscape1} />
            </div>
            <div className="parent" style={{ width: 220 }}>
                <Thumbnail alt="" aspectRatio="vertical" image={IMAGES.portrait1} />
            </div>
        </FlexBox>
        <h2>Constraint parent size & smaller image</h2>
        <FlexBox orientation="horizontal" vAlign="center" gap="huge">
            <div className="parent" style={{ width: 220 }}>
                <Thumbnail alt="" aspectRatio="vertical" image={IMAGES.landscape1s200} />
            </div>
            <div className="parent" style={{ width: 220 }}>
                <Thumbnail alt="" aspectRatio="vertical" image={IMAGES.portrait1s200} />
            </div>
        </FlexBox>
        <h2>With size</h2>
        <FlexBox orientation="horizontal" vAlign="center" gap="huge">
            <Thumbnail alt="" aspectRatio="vertical" image={IMAGES.landscape1} size="xxl" />
            <Thumbnail alt="" aspectRatio="vertical" image={IMAGES.portrait1} size="xxl" />
        </FlexBox>
        <h2>With size & smaller image</h2>
        <FlexBox orientation="horizontal" vAlign="center" gap="huge">
            <Thumbnail alt="" aspectRatio="vertical" image={IMAGES.landscape1s200} size="xxl" />
            <Thumbnail alt="" aspectRatio="vertical" image={IMAGES.portrait1s200} size="xxl" />
        </FlexBox>
        <h2>With size & smaller image & fill height</h2>
        <small>Unsupported use case (use ratio free with fill height)</small>
        <FlexBox orientation="horizontal" vAlign="center" gap="huge">
            <Thumbnail alt="" aspectRatio="vertical" image={IMAGES.landscape1s200} size="xxl" fillHeight />
            <Thumbnail alt="" aspectRatio="vertical" image={IMAGES.portrait1s200} size="xxl" fillHeight />
        </FlexBox>
        <h2>Constrained parent size & smaller image & fill height</h2>
        <small>Unsupported use case (use ratio free with fill height)</small>
        <FlexBox orientation="horizontal" vAlign="center" gap="huge">
            <div className="parent" style={{ width: 220 }}>
                <Thumbnail alt="" aspectRatio="vertical" image={IMAGES.landscape1s200} fillHeight />
            </div>
            <div className="parent" style={{ width: 220 }}>
                <Thumbnail alt="" aspectRatio="vertical" image={IMAGES.portrait1s200} fillHeight />
            </div>
        </FlexBox>
    </>
);

export const Wide = () => (
    <>
        <h1>Ratio: wide</h1>
        <h2>Default</h2>
        <small>Unsupported use case (thumbnail size is undefined)</small>
        <FlexBox orientation="horizontal" vAlign="center" gap="huge">
            <Thumbnail alt="" aspectRatio="wide" image={IMAGES.landscape1} />
            <Thumbnail alt="" aspectRatio="wide" image={IMAGES.portrait1} />
        </FlexBox>
        <h2>Constrained parent size</h2>
        <FlexBox orientation="horizontal" vAlign="center" gap="huge">
            <div className="parent" style={{ width: 220 }}>
                <Thumbnail alt="" aspectRatio="wide" image={IMAGES.landscape1} />
            </div>
            <div className="parent" style={{ width: 220 }}>
                <Thumbnail alt="" aspectRatio="wide" image={IMAGES.portrait1} />
            </div>
        </FlexBox>
        <h2>Constrained parent size & smaller image</h2>
        <FlexBox orientation="horizontal" vAlign="center" gap="huge">
            <div className="parent" style={{ width: 220 }}>
                <Thumbnail alt="" aspectRatio="wide" image={IMAGES.landscape1s200} />
            </div>
            <div className="parent" style={{ width: 220 }}>
                <Thumbnail alt="" aspectRatio="wide" image={IMAGES.portrait1s200} />
            </div>
        </FlexBox>
        <h2>With size</h2>
        <FlexBox orientation="horizontal" vAlign="center" gap="huge">
            <Thumbnail alt="" aspectRatio="wide" image={IMAGES.landscape1} size="xxl" />
            <Thumbnail alt="" aspectRatio="wide" image={IMAGES.portrait1} size="xxl" />
        </FlexBox>
        <h2>With size & smaller image</h2>
        <FlexBox orientation="horizontal" vAlign="center" gap="huge">
            <Thumbnail alt="" aspectRatio="wide" image={IMAGES.landscape1s200} size="xxl" />
            <Thumbnail alt="" aspectRatio="wide" image={IMAGES.portrait1s200} size="xxl" />
        </FlexBox>
        <h2>With size & smaller image & fill height</h2>
        <small>Unsupported use case (use ratio free with fill height)</small>
        <FlexBox orientation="horizontal" vAlign="center" gap="huge">
            <Thumbnail alt="" aspectRatio="wide" image={IMAGES.landscape1s200} size="xxl" fillHeight />
            <Thumbnail alt="" aspectRatio="wide" image={IMAGES.portrait1s200} size="xxl" fillHeight />
        </FlexBox>
        <h2>Constrained parent size & smaller image & fill height</h2>
        <small>Unsupported use case (use ratio free with fill height)</small>
        <FlexBox orientation="horizontal" vAlign="center" gap="huge">
            <div className="parent" style={{ width: 220 }}>
                <Thumbnail alt="" aspectRatio="wide" image={IMAGES.landscape1s200} fillHeight />
            </div>
            <div className="parent" style={{ width: 220 }}>
                <Thumbnail alt="" aspectRatio="wide" image={IMAGES.portrait1s200} fillHeight />
            </div>
        </FlexBox>
    </>
);

export const Square = () => (
    <>
        <h1>Ratio: square</h1>
        <h2>Default</h2>
        <small>Unsupported use case (thumbnail size is undefined)</small>
        <FlexBox orientation="horizontal" vAlign="center" gap="huge">
            <Thumbnail alt="" aspectRatio="square" image={IMAGES.landscape1} />
            <Thumbnail alt="" aspectRatio="square" image={IMAGES.portrait1} />
        </FlexBox>
        <h2>Constrained parent size</h2>
        <FlexBox orientation="horizontal" vAlign="center" gap="huge">
            <div className="parent" style={{ width: 220 }}>
                <Thumbnail alt="" aspectRatio="square" image={IMAGES.landscape1} />
            </div>
            <div className="parent" style={{ width: 220 }}>
                <Thumbnail alt="" aspectRatio="square" image={IMAGES.portrait1} />
            </div>
        </FlexBox>
        <h2>Constrained parent size & smaller image</h2>
        <FlexBox orientation="horizontal" vAlign="center" gap="huge">
            <div className="parent" style={{ width: 220 }}>
                <Thumbnail alt="" aspectRatio="square" image={IMAGES.landscape1s200} />
            </div>
            <div className="parent" style={{ width: 220 }}>
                <Thumbnail alt="" aspectRatio="square" image={IMAGES.portrait1s200} />
            </div>
        </FlexBox>
        <h2>With size</h2>
        <FlexBox orientation="horizontal" vAlign="center" gap="huge">
            <Thumbnail alt="" aspectRatio="square" image={IMAGES.landscape1} size="xxl" />
            <Thumbnail alt="" aspectRatio="square" image={IMAGES.portrait1} size="xxl" />
        </FlexBox>
        <h2>With size & smaller image</h2>
        <FlexBox orientation="horizontal" vAlign="center" gap="huge">
            <Thumbnail alt="" aspectRatio="square" image={IMAGES.landscape1s200} size="xxl" />
            <Thumbnail alt="" aspectRatio="square" image={IMAGES.portrait1s200} size="xxl" />
        </FlexBox>
        <h2>With size & smaller image & fill height</h2>
        <small>Unsupported use case (use ratio free with fill height)</small>
        <FlexBox orientation="horizontal" vAlign="center" gap="huge">
            <Thumbnail alt="" aspectRatio="square" image={IMAGES.landscape1s200} size="xxl" fillHeight />
            <Thumbnail alt="" aspectRatio="square" image={IMAGES.portrait1s200} size="xxl" fillHeight />
        </FlexBox>
        <h2>Constrained parent size & smaller image & fill height</h2>
        <small>Unsupported use case (use ratio free with fill height)</small>
        <FlexBox orientation="horizontal" vAlign="center" gap="huge">
            <div className="parent" style={{ width: 220 }}>
                <Thumbnail alt="" aspectRatio="square" image={IMAGES.landscape1s200} fillHeight />
            </div>
            <div className="parent" style={{ width: 220 }}>
                <Thumbnail alt="" aspectRatio="square" image={IMAGES.portrait1s200} fillHeight />
            </div>
        </FlexBox>
    </>
);

export const ObjectFit = { ...stories.ObjectFit };

export const LoadingPlaceholderImage = () => {
    const [isShown, setShown] = React.useState(false);
    const imgRef = React.useRef() as React.RefObject<HTMLImageElement>;
    return (
        <>
            <Button onClick={() => setShown((shown) => !shown)}>
                Display bigger image using the small image as a placeholder
            </Button>
            <FlexBox orientation="horizontal">
                <Thumbnail alt="Small image" imgRef={imgRef} image="https://picsum.photos/id/15/128/85" />
                {isShown && (
                    <div style={{ maxHeight: 400 }}>
                        <Thumbnail
                            image={`https://picsum.photos/id/15/2500/1667?cacheBust${uniqueId()}`}
                            alt="Large image"
                            loadingPlaceholderImageRef={imgRef}
                            imgProps={{ width: 2500, height: 1667 }}
                        />
                    </div>
                )}
            </FlexBox>
        </>
    );
};
LoadingPlaceholderImage.parameters = { chromatic: { disable: true } };
LoadingPlaceholderImage.tags = ['!snapshot'];
