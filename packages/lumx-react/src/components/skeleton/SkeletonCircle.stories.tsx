import React from 'react';

import { FlexBox, Orientation, Size, SkeletonCircle, ColorPalette } from '@lumx/react';

export default { title: 'LumX components/skeleton/Skeleton' };

const sizes = [Size.xxs, Size.xs, Size.s, Size.m, Size.l, Size.xl, Size.xxl] as const;
const colors = Object.values(ColorPalette);

export const Circle = ({ theme }: any) => (
    <>
        Sizes:
        <FlexBox orientation={Orientation.horizontal}>
            {sizes.map((size) => (
                <SkeletonCircle theme={theme} key={size} size={size} className="lumx-spacing-margin" />
            ))}
        </FlexBox>
        Colors:
        <FlexBox orientation={Orientation.horizontal}>
            {colors.map((color) => (
                <SkeletonCircle theme={theme} size={Size.m} key={color} color={color} className="lumx-spacing-margin" />
            ))}
        </FlexBox>
    </>
);
