import { ProgressCircular } from '@lumx/react';
import React, { Fragment } from 'react';

export default {
    title: 'LumX components/progress/ProgressCircular',
};

const SIZES = ['xxs', 'xs', 's', 'm', undefined] as const;

export const Default = ({ theme }: any) => <ProgressCircular theme={theme} />;

export const Sizes = ({ theme }: any) =>
    SIZES.map((size) => (
        <Fragment key={String(size)}>
            <span>{String(size)}</span>
            <ProgressCircular theme={theme} size={size} />
        </Fragment>
    ));
