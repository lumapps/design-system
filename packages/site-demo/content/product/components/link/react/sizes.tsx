/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { mdiPencil } from '@lumx/icons';
import { Icon, Link } from '@lumx/react';

export const App = () => (
    <>
        <Link href="#" typography="title">
            <Icon icon={mdiPencil} />
            Link with Title typography
        </Link>

        <Link href="#" typography="subtitle2">
            <Icon icon={mdiPencil} />
            Link with Subtitle 2 typography
        </Link>

        <Link href="#" typography="body1">
            <Icon icon={mdiPencil} />
            Link with Body 1 typography
        </Link>

        <Link href="#" typography="caption">
            <Icon icon={mdiPencil} />
            Link with Caption typography
        </Link>
    </>
);
