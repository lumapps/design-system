import { mdiPencil } from '@lumx/icons';
import { ColorPalette, Link, Theme, Typography } from '@lumx/react';
import React from 'react';

/* eslint-disable jsx-a11y/anchor-is-valid */
export const App = ({ theme = Theme.light }: any) => {
    const color = theme === Theme.light ? ColorPalette.primary : ColorPalette.light;
    return (
        <>
            <Link leftIcon={mdiPencil} typography={Typography.title} color={color}>
                Link with Title typography
            </Link>

            <Link leftIcon={mdiPencil} typography={Typography.subtitle2} color={color}>
                Link with Subtitle 2 typography
            </Link>

            <Link leftIcon={mdiPencil} typography={Typography.body1} color={color}>
                Link with Body 1 typography
            </Link>

            <Link leftIcon={mdiPencil} typography={Typography.caption} color={color}>
                Link with Caption typography
            </Link>
        </>
    );
};
