import { SkeletonTypography, Typography, ColorPalette } from '@lumx/react';
import { setup } from '@lumx/core/js/components/Skeleton/SkeletonTypographyStories';

const { meta, ...stories } = setup({
    component: SkeletonTypography,
});

export default {
    title: 'LumX components/skeleton/Skeleton Typography',
    ...meta,
};

export const TextTypography = { ...stories.TextTypography };

// Additional React-specific story
const colors = Object.values(ColorPalette);

export const AllColors = () => (
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
