import { AspectRatio, Size, SkeletonRectangle, SkeletonRectangleVariant } from '@lumx/react';

export const App = ({ theme }: any) => {
    return (
        <>
            <SkeletonRectangle theme={theme} width={Size.xl} aspectRatio={AspectRatio.horizontal} />
            <SkeletonRectangle
                theme={theme}
                width={Size.xl}
                height={Size.m}
                variant={SkeletonRectangleVariant.rounded}
            />
            <SkeletonRectangle theme={theme} width={Size.m} height={Size.s} variant={SkeletonRectangleVariant.pill} />
            <SkeletonRectangle theme={theme} width={Size.l} height={Size.s} variant={SkeletonRectangleVariant.pill} />
        </>
    );
};
