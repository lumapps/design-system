import React from 'react';

import uniqueId from 'lodash/uniqueId';

import { mdiAbTesting } from '@lumx/icons';
import {
    Alignment,
    AspectRatio,
    Badge,
    Button,
    FlexBox,
    GridColumn,
    Icon,
    Size,
    Thumbnail,
    ThumbnailObjectFit,
    ThumbnailVariant,
} from '@lumx/react';
import { CustomLink } from '@lumx/react/stories/utils/CustomLink';
import { IMAGE_SIZES, imageArgType, IMAGES } from '@lumx/react/stories/controls/image';
import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { withNestedProps } from '@lumx/react/stories/decorators/withNestedProps';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withUndefined } from '@lumx/react/stories/controls/withUndefined';

const aligns = [Alignment.center, Alignment.left, Alignment.right];
const variants = [ThumbnailVariant.squared, ThumbnailVariant.rounded];

export default {
    title: 'LumX components/thumbnail/Thumbnail',
    component: Thumbnail,
    args: Thumbnail.defaultProps,
    argTypes: {
        image: imageArgType,
        align: getSelectArgType(aligns),
        variant: getSelectArgType(variants),
        aspectRatio: getSelectArgType(AspectRatio),
        fallback: { control: false },
        'focusPoint.x': { control: { type: 'range', max: 1, min: -1, step: 0.05 } },
        'focusPoint.y': { control: { type: 'range', max: 1, min: -1, step: 0.05 } },
    },
    decorators: [withNestedProps()],
};

/** Simple thumbnail taking the size of the original image */
export const Simple = {
    args: { image: IMAGES.landscape1s200 },
    decorators: [
        withWrapper({
            style: { border: '1px dashed red', height: 500, width: 500, resize: 'both', overflow: 'hidden' },
        }),
    ],
};

/** Loading state*/
export const IsLoading = {
    args: { ...Simple.args, isLoading: true },
};

export const WithoutSource = {
    args: { image: IMAGES.emptyImage, size: Size.xxl, aspectRatio: AspectRatio.square },
};

/** Thumbnail error fallback and size variants */
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

/** Simple thumbnail with badge */
export const WithBadge = {
    ...Simple,
    args: {
        ...Simple.args,
        size: Size.xl,
        badge: (
            <Badge color="green">
                <Icon icon={mdiAbTesting} />
            </Badge>
        ),
    },
};

/** Demonstrate the focus point X on a vertical thumbnail containing an horizontal image */
export const FocusPointVertical = {
    args: {
        aspectRatio: AspectRatio.vertical,
        size: Size.xxl,
        image: IMAGES.landscape1,
        'focusPoint.x': 1,
    },
};

/** Demonstrate the focus point Y on a horizontal thumbnail containing an vertical image */
export const FocusPointHorizontal = {
    args: {
        aspectRatio: AspectRatio.horizontal,
        size: Size.xxl,
        image: IMAGES.portrait1,
        'focusPoint.y': 1,
    },
};

/** Setting `onClick` to turn the thumbnail into a button */
export const AsButton = {
    args: Simple.args,
    argTypes: { onClick: { action: true } },
};

/** Setting `linkProps.href` to turn the thumbnail into a link */
export const AsLink = {
    args: { ...Simple.args, linkProps: { href: 'https://example.com' } },
};

/** Setting `href` to turn the thumbnail into a link */
export const AsCustomLink = {
    args: { ...Simple.args, linkAs: CustomLink, linkProps: { href: 'https://example.com' } },
};

/** Combinations of fillHeight and ratios */
export const FillHeightAndRatio = {
    ...Simple,
    args: { ...Simple.args, fillHeight: true },

    decorators: [
        ...Simple.decorators,
        withCombinations({ combinations: { rows: { key: 'aspectRatio', options: withUndefined(AspectRatio) } } }),
    ],
};

/**
 * Simple thumbnail with svg image
 * */
export const WithSvgImages = {
    args: {
        image: IMAGES.defaultSvg,
        size: Size.xxl,
        fillHeight: true,
        'focusPoint.x': 1,
    },
};

export const Original = () => (
    <>
        <h1>Ratio: Original</h1>
        <h2>Default</h2>
        <table>
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

export const ObjectFit = {
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
};

/**
 * Demonstrate loading a small image and then use it as the loading placeholder image when loading a bigger image
 */
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
                            // Loading placeholder image
                            loadingPlaceholderImageRef={imgRef}
                            // Reserve space
                            imgProps={{ width: 2500, height: 1667 }}
                        />
                    </div>
                )}
            </FlexBox>
        </>
    );
};
// Disables Chromatic snapshot (not relevant for this story).
LoadingPlaceholderImage.parameters = { chromatic: { disable: true } };
