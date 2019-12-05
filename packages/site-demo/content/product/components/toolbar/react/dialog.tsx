import React from 'react';

import classNames from 'classnames';

import { mdiMenuDown, mdiTranslate } from '@lumx/icons';

import { Button, Emphasis, Toolbar } from '@lumx/react';

const App = ({ theme }) => (
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
        after={
            <Button emphasis={Emphasis.low} theme={theme} leftIcon={mdiTranslate} rightIcon={mdiMenuDown}>
                Value
            </Button>
        }
    />
);

export default App;
