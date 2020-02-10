import React from 'react';

import classNames from 'classnames';

import { mdiMagnify } from '@lumx/icons';

import { Emphasis, IconButton, Toolbar } from '@lumx/react';

const App = ({ theme }: any) => (
    <Toolbar
        label={
            <span
                className={classNames(
                    'lumx-typography-title',
                    theme === 'light' ? 'lumx-theme-color-dark-N' : 'lumx-theme-color-light-N',
                )}
            >
                Toolbar title
            </span>
        }
        after={<IconButton emphasis={Emphasis.low} theme={theme} icon={mdiMagnify} />}
    />
);

export default App;
