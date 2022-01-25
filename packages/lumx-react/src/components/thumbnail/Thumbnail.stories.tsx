import React from 'react';

import { mdiAbTesting } from '@lumx/icons';
import {
    Alignment,
    AspectRatio,
    Badge,
    ColorPalette,
    FlexBox,
    Icon,
    Size,
    Thumbnail,
    ThumbnailVariant,
} from '@lumx/react';
import { IMAGE_SIZES, imageKnob, IMAGES } from '@lumx/react/stories/knobs/image';
import { boolean, select, text } from '@storybook/addon-knobs';
import { enumKnob } from '@lumx/react/stories/knobs/enumKnob';
import { focusKnob } from '@lumx/react/stories/knobs/focusKnob';
import { sizeKnob } from '@lumx/react/stories/knobs/sizeKnob';
import { action } from '@storybook/addon-actions';
import classNames from 'classnames';
import { CustomLink } from '@lumx/react/stories/utils/CustomLink';

export default { title: 'LumX components/thumbnail/Thumbnail' };

const Resizable = ({ initialSize: { width, height }, children }: any) => (
    <div style={{ border: '1px solid red', overflow: 'hidden', resize: 'both', width, height }}>{children}</div>
);

/** Default thumbnail props (editable via knobs) */
export const Default = ({ theme }: any) => {
    const alt = text('Alternative text', 'Image alt text');
    const align = enumKnob(
        'Alignment',
        [undefined, Alignment.center, Alignment.left, Alignment.right] as const,
        undefined,
    );
    const aspectRatio = enumKnob('Aspect ratio', [undefined, ...Object.values(AspectRatio)], undefined);
    const fillHeight = boolean('Fill Height', false);
    const focusPoint = { x: focusKnob('Focus X'), y: focusKnob('Focus Y') };
    const image = imageKnob('Image', IMAGES.landscape1);
    const variant = select('Variant', ThumbnailVariant, ThumbnailVariant.squared);
    const size = sizeKnob('Size', undefined);
    const onClick = boolean('clickable?', false) ? action('onClick') : undefined;
    const isLoading = boolean('Force loading', false);
    const forceError = boolean('Force error', false);

    return (
        <Thumbnail
            alt={alt}
            align={align}
            aspectRatio={aspectRatio}
            fillHeight={fillHeight}
            focusPoint={focusPoint}
            image={forceError ? 'foo' : image}
            size={size}
            theme={theme}
            variant={variant}
            onClick={onClick}
            isLoading={isLoading}
        />
    );
};

export const WithBadge = () => {
    const thumbnailSize = sizeKnob('Size', Size.l);
    const variant = select('Variant', ThumbnailVariant, ThumbnailVariant.rounded);
    const badgeColor = select('Badge color', ColorPalette, ColorPalette.primary);
    const activateFallback = boolean('Activate fallback', false);
    const image = imageKnob();
    return (
        <Thumbnail
            alt="Image alt text"
            image={activateFallback ? '' : image}
            variant={variant}
            aspectRatio={AspectRatio.square}
            size={thumbnailSize}
            badge={
                <Badge color={badgeColor}>
                    <Icon icon={mdiAbTesting} />
                </Badge>
            }
        />
    );
};

export const FocusPoint = () => {
    const focusPoint = { x: focusKnob('Focus X ', -0.2), y: focusKnob('Focus Y', -0.3) };
    const aspectRatio = enumKnob('Aspect ratio', [undefined, ...Object.values(AspectRatio)], AspectRatio.wide);
    const fillHeight = aspectRatio === AspectRatio.free;
    return (
        <>
            <small>Focus point will delay the display of the image if the original image size is not accessible.</small>
            <Resizable initialSize={{ height: 200, width: 300 }}>
                <Thumbnail
                    alt="Image"
                    image={IMAGES.portrait1s200}
                    aspectRatio={aspectRatio}
                    fillHeight={fillHeight}
                    focusPoint={focusPoint}
                    style={{ width: '100%' }}
                />
            </Resizable>

            <small>Providing the width & height in imgProps should avoid the delay shown above</small>
            <Resizable initialSize={{ height: 200, width: 300 }}>
                <Thumbnail
                    alt="Image"
                    image={IMAGES.portrait2}
                    imgProps={IMAGE_SIZES.portrait2}
                    fillHeight={fillHeight}
                    aspectRatio={aspectRatio}
                    focusPoint={focusPoint}
                    style={{ width: '100%' }}
                />
            </Resizable>
        </>
    );
};

export const Clickable = () => (
    <Thumbnail alt="Click me" image={imageKnob()} size={sizeKnob('Size', Size.xxl)} onClick={action('onClick')} />
);

export const ClickableLink = () => (
    <Thumbnail
        alt="Click me"
        image={imageKnob()}
        size={sizeKnob('Size', Size.xxl)}
        linkProps={{ href: 'https://google.fr' }}
    />
);

export const ClickableCustomLink = () => (
    <Thumbnail
        alt="Click me"
        image={imageKnob()}
        size={sizeKnob('Size', Size.xxl)}
        linkAs={CustomLink}
        linkProps={{ href: 'https://google.fr', className: 'custom-class-name' }}
    />
);

export const FillHeight = () => {
    const parentStyle = {
        width: 600,
        height: 240,
        border: '1px solid red',
        overflow: 'hidden',
        resize: 'both',
    } as const;
    return (
        <>
            <h2>Default</h2>
            <div style={parentStyle}>
                <Thumbnail alt="" image={IMAGES.landscape1s200} fillHeight />
            </div>
            <h2>Ratio wide</h2>
            <div style={parentStyle}>
                <Thumbnail alt="" image={IMAGES.landscape1s200} fillHeight aspectRatio="wide" />
            </div>
            <h2>Ratio vertical</h2>
            <div style={parentStyle}>
                <Thumbnail alt="" image={IMAGES.landscape1s200} fillHeight aspectRatio="vertical" />
            </div>
            <h2>Ratio free</h2>
            <div style={parentStyle}>
                <Thumbnail alt="" image={IMAGES.landscape1s200} fillHeight aspectRatio="free" />
            </div>
        </>
    );
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
                    <Thumbnail alt="" image={IMAGES.landscape1} />
                </td>
                <td>
                    <Thumbnail alt="" image={IMAGES.landscape1} imgProps={IMAGE_SIZES.landscape1} />
                </td>
                <td>
                    <Thumbnail alt="" image={IMAGES.portrait1} />
                </td>
                <td>
                    <Thumbnail alt="" image={IMAGES.portrait1} imgProps={IMAGE_SIZES.portrait1} />
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

export const IsLoading = ({ theme }: any) => (
    <FlexBox
        orientation="horizontal"
        vAlign="center"
        marginAuto={['left', 'right']}
        style={{ border: '1px solid red', width: 900, height: 700, resize: 'both', overflow: 'auto' }}
    >
        <Thumbnail
            theme={theme}
            alt="Image alt text"
            image={IMAGES.landscape2}
            isLoading={boolean('Force loading', true)}
            fillHeight={boolean('Fill Height', false)}
            size={sizeKnob('Size', undefined)}
        />
    </FlexBox>
);

export const ErrorFallbackVariants = ({ theme }: any) => {
    const isLoading = boolean('Force loading', false);
    const variant = select('Variant', ThumbnailVariant, undefined);
    const base = { alt: 'foo', image: 'foo', isLoading, variant, theme } as const;
    const imageFallback = <img src="/logo.svg" alt="logo" />;
    const imgProps = { width: 50, height: 50 };

    return (
        <>
            <h2>Default</h2>
            <FlexBox orientation="horizontal" gap="big">
                <Thumbnail {...base} />
                <Thumbnail {...base} fallback={mdiAbTesting} />
                <Thumbnail {...base} fallback={imageFallback} />
            </FlexBox>
            <h2>
                With original image size <small>(50x50)</small>
            </h2>
            <FlexBox orientation="horizontal" gap="big">
                <Thumbnail {...base} imgProps={imgProps} />
                <Thumbnail {...base} fallback={mdiAbTesting} imgProps={imgProps} />
                <Thumbnail {...base} fallback={imageFallback} imgProps={imgProps} />
            </FlexBox>
            <h2>With size</h2>
            <FlexBox orientation="horizontal" gap="big">
                <Thumbnail {...base} size="xl" />
                <Thumbnail {...base} size="xl" fallback={mdiAbTesting} />
                <Thumbnail {...base} size="xl" fallback={imageFallback} />
            </FlexBox>
            <h2>With size & ratio</h2>
            <FlexBox orientation="horizontal" gap="big">
                <Thumbnail {...base} size="xl" aspectRatio="wide" />
                <Thumbnail {...base} size="xl" aspectRatio="wide" fallback={mdiAbTesting} />
                <Thumbnail {...base} size="xl" aspectRatio="wide" fallback={imageFallback} />
            </FlexBox>
            <h2>
                With original size <small>(50x50)</small> & ratio
            </h2>
            <small>Unsupported use case (thumbnail size is undefined)</small>
            <FlexBox orientation="horizontal" gap="big">
                <Thumbnail {...base} imgProps={imgProps} aspectRatio="wide" />
                <Thumbnail {...base} imgProps={imgProps} aspectRatio="wide" fallback={mdiAbTesting} />
                <Thumbnail {...base} imgProps={imgProps} aspectRatio="wide" fallback={imageFallback} />
            </FlexBox>
            <h2>
                With original size <small>(50x50)</small> & ratio & constrained parent size
            </h2>
            <FlexBox orientation="horizontal" gap="big">
                <div className="parent" style={{ width: 220 }}>
                    <Thumbnail {...base} imgProps={imgProps} aspectRatio="wide" />
                </div>
                <div className="parent" style={{ width: 220 }}>
                    <Thumbnail {...base} imgProps={imgProps} aspectRatio="wide" fallback={mdiAbTesting} />
                </div>
                <div className="parent" style={{ width: 220 }}>
                    <Thumbnail {...base} imgProps={imgProps} aspectRatio="wide" fallback={imageFallback} />
                </div>
            </FlexBox>
        </>
    );
};
