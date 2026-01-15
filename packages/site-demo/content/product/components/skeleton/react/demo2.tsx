import { SkeletonRectangle, Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <>
        <SkeletonRectangle theme={theme} width="xl" aspectRatio="horizontal" />
        <SkeletonRectangle theme={theme} width="xl" height="m" variant="rounded" />
        <SkeletonRectangle theme={theme} width="m" height="s" variant="pill" />
        <SkeletonRectangle theme={theme} width="l" height="s" variant="pill" />
    </>
);
