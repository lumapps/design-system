import { Size, SkeletonCircle } from '@lumx/react';
import React from 'react';

export const App = ({ theme }: any) => {
    return (
        <>
            <SkeletonCircle theme={theme} size={Size.m} />
            <SkeletonCircle theme={theme} size={Size.l} />
            <SkeletonCircle theme={theme} size={Size.xl} />
        </>
    );
};
