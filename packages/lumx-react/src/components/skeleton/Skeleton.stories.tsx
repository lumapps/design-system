import React from 'react';

import {
    Size,
    SkeletonCircle,
    SkeletonRectangle,
    SkeletonRectangleVariant,
    SkeletonTypography,
    Typography,
} from '@lumx/react';

export default { title: 'LumX components/skeleton/Skeleton' };

const skeletonSizes: Size[] = [Size.xxs, Size.xs, Size.s, Size.m, Size.l, Size.xl, Size.xxl];

export const skeletonCircle = () =>
    skeletonSizes.map((size) =>
        <SkeletonCircle key={size} size={size} />,
    );

export const skeletonRectangular = () => (
        <>
            <SkeletonRectangle
                width={Size.xl}
                height={Size.m}
                variant={SkeletonRectangleVariant.rounded}
                className="lumx-spacing-margin-bottom"
            />
            <SkeletonRectangle width={Size.l} height={Size.s} variant={SkeletonRectangleVariant.pill} />
        </>
    );

export const skeletonTypography = () =>  (
        <>
            <SkeletonTypography typography={Typography.title} width="30%" className="lumx-spacing-margin-bottom" />
            <SkeletonTypography typography={Typography.body1} />
            <SkeletonTypography typography={Typography.body1} />
            <SkeletonTypography typography={Typography.body1} />
            <SkeletonTypography typography={Typography.body1} width="70%" />
        </>
    );
