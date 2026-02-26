import { GenericBlock, SkeletonCircle, SkeletonTypography, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <GenericBlock orientation="horizontal" gap="big" style={{ width: 200 }}>
        <GenericBlock.Figure>
            <SkeletonCircle theme={theme} size="m" />
        </GenericBlock.Figure>

        <GenericBlock.Content>
            <SkeletonTypography theme={theme} typography="body1" />
            <SkeletonTypography theme={theme} typography="caption" width="60%" />
        </GenericBlock.Content>
    </GenericBlock>
);
