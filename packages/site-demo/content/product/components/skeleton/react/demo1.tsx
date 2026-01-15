import { SkeletonCircle, Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <>
        <SkeletonCircle theme={theme} size="m" />
        <SkeletonCircle theme={theme} size="l" />
        <SkeletonCircle theme={theme} size="xl" />
    </>
);
