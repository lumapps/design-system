import React from 'react';

import {
    AspectRatio,
    GlobalSize,
    Size,
    SkeletonCircle,
    SkeletonRectangle,
    SkeletonRectangleVariant,
    SkeletonTypography,
    Typography,
} from '@lumx/react';

export default { title: 'LumX components/skeleton/Skeleton' };

const sizes: GlobalSize[] = [Size.xxs, Size.xs, Size.s, Size.m, Size.l, Size.xl, Size.xxl];

export const skeletonCircle = ({ theme }: any) =>
    sizes.map((size) => <SkeletonCircle theme={theme} key={size} size={size} />);

export const skeletonRectangle = ({ theme }: any) => (
    <>
        <SkeletonRectangle
            theme={theme}
            width={Size.xl}
            height={Size.m}
            variant={SkeletonRectangleVariant.rounded}
            className="lumx-spacing-margin-bottom"
        />
        <SkeletonRectangle
            theme={theme}
            width={Size.l}
            height={Size.s}
            variant={SkeletonRectangleVariant.pill}
            className="lumx-spacing-margin-bottom"
        />
        <SkeletonRectangle theme={theme} width={Size.xxl} aspectRatio={AspectRatio.horizontal} />
    </>
);

export const skeletonTypography = ({ theme }: any) => (
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
