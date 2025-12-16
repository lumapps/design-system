import { mdiMagnify } from '@lumx/icons';

import { Emphasis, IconButton, Theme, Toolbar } from '@lumx/react';

import classNames from 'classnames';

export const App = ({ theme = Theme.light }: any) => (
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
        after={<IconButton label="Search" emphasis={Emphasis.low} theme={theme} icon={mdiMagnify} />}
    />
);
