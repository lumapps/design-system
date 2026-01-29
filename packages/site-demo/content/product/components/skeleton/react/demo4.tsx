import { GenericBlock, SkeletonCircle, SkeletonTypography, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <GenericBlock orientation="horizontal" gap="big">
        <GenericBlock.Figure>
            <SkeletonCircle theme={theme} size="m" />
        </GenericBlock.Figure>

        <GenericBlock.Content style={{ width: 200 }}>
            <SkeletonTypography theme={theme} typography="body1" />
            <SkeletonTypography theme={theme} typography="caption" width="60%" />
        </GenericBlock.Content>
    </GenericBlock>
);
