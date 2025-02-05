import React from 'react';

import { SkeletonTypography, Typography, ColorPalette } from '@lumx/react';

export default { title: 'LumX components/skeleton/Skeleton Typography' };

const colors = Object.values(ColorPalette);

export const TextTypography = () => (
    <>
        <SkeletonTypography typography={Typography.title} width="30%" className="lumx-spacing-margin-bottom" />
        <SkeletonTypography typography={Typography.body1} />
        <SkeletonTypography typography={Typography.body1} />
        <SkeletonTypography typography={Typography.body1} />
        <SkeletonTypography typography={Typography.body1} width="70%" />
        Colors:
        {colors.map((color) => (
            <SkeletonTypography key={color} color={color} typography={Typography.body1} />
        ))}
    </>
);
