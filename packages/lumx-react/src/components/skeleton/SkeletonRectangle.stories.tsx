import React, { useEffect, useState } from 'react';

import {
    Alignment,
    AspectRatio,
    Button,
    FlexBox,
    Orientation,
    Size,
    SkeletonRectangle,
    SkeletonRectangleVariant,
    Thumbnail,
} from '@lumx/react';
import { imageKnob } from '@lumx/react/stories/knobs';

export default { title: 'LumX components/skeleton/Skeleton' };

const variants = [
    SkeletonRectangleVariant.squared,
    SkeletonRectangleVariant.rounded,
    SkeletonRectangleVariant.pill,
] as const;
const sizes = [Size.xxs, Size.xs, Size.s, Size.m, Size.l, Size.xl, Size.xxl] as const;
const aspectRatios = [AspectRatio.vertical, AspectRatio.square, AspectRatio.horizontal, AspectRatio.wide] as const;

export const Rectangle = ({ theme }: any) => (
    <>
        Sizes:
        <FlexBox orientation={Orientation.horizontal}>
            {sizes.map((size) => (
                <SkeletonRectangle
                    key={size}
                    className="lumx-spacing-margin"
                    theme={theme}
                    height={size}
                    width={size}
                />
            ))}
        </FlexBox>
        Variants:
        <FlexBox orientation={Orientation.horizontal}>
            {variants.map((variant) => (
                <SkeletonRectangle
                    key={variant}
                    className="lumx-spacing-margin"
                    theme={theme}
                    width={Size.xl}
                    height={Size.m}
                    variant={variant}
                />
            ))}
        </FlexBox>
        Ratios:
        <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.top}>
            {aspectRatios.map((aspectRatio) => (
                <SkeletonRectangle
                    key={aspectRatio}
                    className="lumx-spacing-margin"
                    theme={theme}
                    width={Size.xl}
                    aspectRatio={aspectRatio}
                />
            ))}
        </FlexBox>
    </>
);

export const LoadingThumbnail = ({ theme }: any) => {
    const [loading, setLoading] = useState(true);
    const fakeLoad = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };
    useEffect(fakeLoad, []);
    const size = Size.xl;

    return (
        <>
            <Button onClick={fakeLoad}>Reload</Button> (fake 2sec loading)
            <Thumbnail
                image={imageKnob()}
                alt="Image"
                style={{ display: loading ? 'none' : undefined }}
                aspectRatio={AspectRatio.square}
                size={size}
            />
            {loading && <SkeletonRectangle theme={theme} width={size} aspectRatio={AspectRatio.square} />}
        </>
    );
};
