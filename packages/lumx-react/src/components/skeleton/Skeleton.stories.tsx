import React, { useEffect, useState } from 'react';

import {
    Alignment,
    AspectRatio,
    Button,
    FlexBox,
    Orientation,
    Size,
    SkeletonCircle,
    SkeletonRectangle,
    SkeletonRectangleVariant,
    SkeletonTypography,
    Thumbnail,
    Typography,
} from '@lumx/react';

export default { title: 'LumX components/skeleton/Skeleton' };

const variants = [
    SkeletonRectangleVariant.squared,
    SkeletonRectangleVariant.rounded,
    SkeletonRectangleVariant.pill,
] as const;
const sizes = [Size.xxs, Size.xs, Size.s, Size.m, Size.l, Size.xl, Size.xxl] as const;
const aspectRatios = [AspectRatio.vertical, AspectRatio.square, AspectRatio.horizontal] as const;

export const Circle = ({ theme }: any) => (
    <FlexBox orientation={Orientation.horizontal}>
        {sizes.map((size) => (
            <SkeletonCircle theme={theme} key={size} size={size} className="lumx-spacing-margin" />
        ))}
    </FlexBox>
);

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

export const TextTypography = ({ theme }: any) => (
    <>
        <SkeletonTypography
            theme={theme}
            typography={Typography.title}
            width="30%"
            className="lumx-spacing-margin-bottom"
        />
        <SkeletonTypography theme={theme} typography={Typography.body1} />
        <SkeletonTypography theme={theme} typography={Typography.body1} />
        <SkeletonTypography theme={theme} typography={Typography.body1} />
        <SkeletonTypography theme={theme} typography={Typography.body1} width="70%" />
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
                style={{ display: loading ? 'none' : undefined }}
                image="https://picsum.photos/72/72/?random"
                aspectRatio={AspectRatio.square}
                size={size}
            />
            {loading && <SkeletonRectangle theme={theme} width={size} aspectRatio={AspectRatio.square} />}
        </>
    );
};
