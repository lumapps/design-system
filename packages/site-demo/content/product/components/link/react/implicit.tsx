import { mdiPencil } from '@lumx/icons';
import { ColorPalette, Link, Theme, Typography } from '@lumx/react';
import React from 'react';

/* eslint-disable jsx-a11y/anchor-is-valid */
export const App = ({ theme = Theme.light }: any) => {
    const color = theme === Theme.light ? ColorPalette.dark : ColorPalette.light;
    return (
        <>
            <Link color={color}>Default link</Link>

            <Link leftIcon={mdiPencil} color={color}>
                Link with an icon
            </Link>

            <Link color={color} typography={Typography.title}>
                Link with Title typography
            </Link>
        </>
    );
};
