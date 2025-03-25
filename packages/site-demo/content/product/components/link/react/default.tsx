/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { mdiPencil } from '@lumx/icons';
import { Icon, Link } from '@lumx/react';

export const App = () => (
    <>
        <Link href="#">Default link</Link>

        <Link href="#">
            <Icon icon={mdiPencil} />
            Link with an icon
        </Link>
    </>
);
