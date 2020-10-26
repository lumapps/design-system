import { mdiMagnify } from '@lumx/icons';

import { Emphasis, IconButton, Toolbar } from '@lumx/react';

import classNames from 'classnames';
import React from 'react';

export const App = ({ theme }: any) => (
    <Toolbar
        label={
            <span
                className={classNames(
                    'lumx-typography-title',
                    theme === 'light' ? 'lumx-color-font-dark-N' : 'lumx-color-font-light-N',
                )}
            >
                Toolbar title
            </span>
        }
        after={<IconButton emphasis={Emphasis.low} theme={theme} icon={mdiMagnify} />}
    />
);
