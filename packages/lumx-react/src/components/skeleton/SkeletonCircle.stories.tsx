import React from 'react';

import { FlexBox, Orientation, Size, SkeletonCircle } from '@lumx/react';

export default { title: 'LumX components/skeleton/Skeleton' };

const sizes = [Size.xxs, Size.xs, Size.s, Size.m, Size.l, Size.xl, Size.xxl] as const;

export const Circle = ({ theme }: any) => (
    <FlexBox orientation={Orientation.horizontal}>
        {sizes.map((size) => (
            <SkeletonCircle theme={theme} key={size} size={size} className="lumx-spacing-margin" />
        ))}
    </FlexBox>
);
