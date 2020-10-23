import { Progress, ProgressVariant } from '@lumx/react';
import React from 'react';

export const App = ({ theme }: any) => (
    <>
        <Progress theme={theme} variant={ProgressVariant.linear} />
    </>
);
