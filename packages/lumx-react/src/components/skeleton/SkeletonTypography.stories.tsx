import React from 'react';

import { SkeletonTypography, Typography, ColorPalette } from '@lumx/react';

export default { title: 'LumX components/skeleton/Skeleton Typography' };

const colors = Object.values(ColorPalette);

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
        Colors:
        {colors.map((color) => (
            <SkeletonTypography key={color} color={color} theme={theme} typography={Typography.body1} />
        ))}
    </>
);
