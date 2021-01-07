import React from 'react';

import { SkeletonTypography, Typography } from '@lumx/react';

export default { title: 'LumX components/skeleton/Skeleton' };

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
